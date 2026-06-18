/**
 * Key vault — persists the user's decrypted keypair in IndexedDB.
 *
 * Lifecycle:
 *   sign-up:  server returns `keyMaterial = { ecdhPublicKey, signPublicKey,
 *                                          encryptedPrivateKey, recoveryCode }`.
 *             We store the encryptedPrivateKey blob + public keys as-is,
 *             and show the recoveryCode to the user (one-time only).
 *
 *   sign-in:  server returns the encryptedPrivateKey blob. We ask the user
 *             for their password, run PBKDF2(200k) to derive the KEK,
 *             decrypt the private keys, and stash the cleartext in
 *             localforage for the duration of the session.
 *
 *   decrypt:  message detail returns `encryptedBody` (envelope). We use the
 *             cached private key to unwrap the DEK and decrypt the body.
 *
 *   sign-out: clear the cleartext key cache. The encrypted blob + recovery
 *             code remain on disk for next sign-in.
 */
import localforage from "localforage";
import {
  decryptKeyPair,
  type KeyPair,
  decryptFromEnvelope,
  type Envelope,
} from "@ui/crypto";

interface StoredEncrypted {
  ciphertext: string;
  iv: string;
  salt: string;
}

interface KeyMaterialBlob {
  ecdhPublicKey: string;
  signPublicKey: string;
  encryptedPrivateKey: StoredEncrypted;
}

const encryptedStore = localforage.createInstance({
  name: "ChainmailVault",
  storeName: "encrypted",
  description: "Encrypted private keys (password-protected blob)",
});

const decryptedStore = localforage.createInstance({
  name: "ChainmailVault",
  storeName: "decrypted",
  description: "Decrypted keypair cache (cleared on sign-out)",
});

const KeyStore = {
  Encrypted: {
    save: (userId: string, blob: KeyMaterialBlob) =>
      encryptedStore.setItem(`kp.${userId}`, blob),
    load: (userId: string) => encryptedStore.getItem<KeyMaterialBlob>(`kp.${userId}`),
    remove: (userId: string) => encryptedStore.removeItem(`kp.${userId}`),
  },
  Decrypted: {
    save: (userId: string, kp: KeyPair) => decryptedStore.setItem(`kp.${userId}`, kp),
    load: (userId: string) => decryptedStore.getItem<KeyPair>(`kp.${userId}`),
    remove: (userId: string) => decryptedStore.removeItem(`kp.${userId}`),
  },
};

/** Save the just-received key material. Called on sign-up. */
export async function saveKeyMaterial(userId: string, blob: KeyMaterialBlob): Promise<void> {
  await KeyStore.Encrypted.save(userId, blob);
}

/** Decrypt the private key with the password, cache it for the session. */
export async function unlockKeyMaterial(
  userId: string,
  password: string
): Promise<KeyPair | null> {
  const blob = await KeyStore.Encrypted.load(userId);
  if (!blob) return null;
  try {
    const kp = await decryptKeyPair(blob.encryptedPrivateKey, password);
    await KeyStore.Decrypted.save(userId, kp);
    return kp;
  } catch {
    // Wrong password
    return null;
  }
}

/** Get the cached decrypted keypair (or null if session is locked). */
export async function getUnlockedKey(userId: string): Promise<KeyPair | null> {
  return (await KeyStore.Decrypted.load(userId)) ?? null;
}

/** Clear the in-memory key cache. Called on sign-out. */
export async function lockKeyMaterial(userId: string): Promise<void> {
  await KeyStore.Decrypted.remove(userId);
}

/** Decrypt a message envelope using the unlocked private key. */
export async function decryptMessageBody(envelopeJson: string, kp: KeyPair): Promise<string> {
  const env = JSON.parse(envelopeJson) as Envelope;
  return decryptFromEnvelope(env, kp.ecdhPrivateKey);
}

export type { KeyMaterialBlob, KeyPair };
