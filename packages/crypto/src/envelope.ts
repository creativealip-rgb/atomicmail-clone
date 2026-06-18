/**
 * Per-message envelope encryption (W3.5)
 *
 * Flow:
 *   1. Server generates a random AES-256 data key (DEK) + IV
 *   2. Encrypts plaintext body with AES-GCM(DEK, IV)
 *   3. Server generates a fresh X25519 ephemeral keypair
 *   4. ECDH(server-ephemeral-priv, user-ecdh-pub) → shared secret
 *   5. HKDF → KEK (Key Encryption Key)
 *   6. AES-GCM wrap(DEK) with KEK
 *   7. Store: ciphertext (body), iv, authTag, ephemeralPub, wrappedDek, wrappedIv
 *
 * Decrypt (client):
 *   1. ECDH(my-priv, ephemeral-pub) → same shared secret
 *   2. HKDF → KEK
 *   3. Unwrap DEK
 *   4. AES-GCM decrypt body
 */
import { base64 } from "./keypair.js";
import { ecdhSharedSecret, hkdfDerive, deriveAesKey } from "./ecdh.js";

const enc = new TextEncoder();
const dec = new TextDecoder();

/** Result of server-side envelope encryption */
export interface Envelope {
  /** base64 — AES-GCM ciphertext of body (ct + 16-byte tag) */
  ciphertext: string;
  /** base64 — 12-byte IV used for body */
  iv: string;
  /** base64 — 16-byte auth tag (last 16 bytes of AES-GCM output) */
  authTag: string;
  /** base64 — server's ephemeral X25519 public key (raw, 32 bytes) */
  ephemeralPublicKey: string;
  /** base64 — AES-GCM ciphertext of DEK (wrapped key) */
  wrappedKey: string;
  /** base64 — 12-byte IV for key wrap */
  wrapIv: string;
  /** base64 — 16-byte auth tag for key wrap */
  wrapAuthTag: string;
}

export async function encryptForRecipient(
  plaintext: string,
  recipientEcdhPublicKeyB64: string
): Promise<Envelope> {
  // 1. Random DEK (data encryption key)
  const dek = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapIv = crypto.getRandomValues(new Uint8Array(12));

  // 2. Encrypt body with DEK
  const aesKey = await crypto.subtle.importKey("raw", dek as BufferSource, "AES-GCM", false, ["encrypt"]);
  const ctBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    aesKey,
    enc.encode(plaintext) as BufferSource
  );
  const ctBytes = new Uint8Array(ctBuf);
  const ctBody = ctBytes.slice(0, -16);
  const authTag = ctBytes.slice(-16);

  // 3. Server ephemeral X25519 keypair
  const eph = (await crypto.subtle.generateKey(
    { name: "X25519" },
    true,
    ["deriveBits"]
  )) as CryptoKeyPair;
  const ephPubRaw = await crypto.subtle.exportKey("raw", eph.publicKey);

  // 4. ECDH(eph-priv, recipient-pub) → shared secret
  const shared = await crypto.subtle.deriveBits(
    { name: "X25519", public: await crypto.subtle.importKey("raw", base64.decode(recipientEcdhPublicKeyB64) as BufferSource, { name: "X25519" }, false, []) } as any,
    eph.privateKey,
    256
  );

  // 5. HKDF → KEK
  const kek = await deriveAesKey(new Uint8Array(shared), "chainmail-envelope-v1");

  // 6. Wrap DEK with KEK
  const wrapCtBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: wrapIv as BufferSource },
    kek,
    dek as BufferSource
  );
  const wrapCtBytes = new Uint8Array(wrapCtBuf);
  const wrappedKey = wrapCtBytes.slice(0, -16);
  const wrapAuthTag = wrapCtBytes.slice(-16);

  return {
    ciphertext: base64.encode(ctBody),
    iv: base64.encode(iv),
    authTag: base64.encode(authTag),
    ephemeralPublicKey: base64.encode(ephPubRaw),
    wrappedKey: base64.encode(wrappedKey),
    wrapIv: base64.encode(wrapIv),
    wrapAuthTag: base64.encode(wrapAuthTag),
  };
}

export async function decryptFromEnvelope(
  envelope: Envelope,
  myEcdhPrivateKeyB64: string
): Promise<string> {
  // 1. ECDH(my-priv, ephemeral-pub) → shared secret
  const shared = await ecdhSharedSecret(myEcdhPrivateKeyB64, envelope.ephemeralPublicKey);

  // 2. HKDF → KEK
  const kek = await deriveAesKey(shared, "chainmail-envelope-v1");

  // 3. Unwrap DEK
  const wrappedCombined = new Uint8Array(base64.decode(envelope.wrappedKey).length + base64.decode(envelope.wrapAuthTag).length);
  wrappedCombined.set(base64.decode(envelope.wrappedKey), 0);
  wrappedCombined.set(base64.decode(envelope.wrapAuthTag), base64.decode(envelope.wrappedKey).length);
  const dekBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64.decode(envelope.wrapIv) as BufferSource },
    kek,
    wrappedCombined as BufferSource
  );
  const dek = new Uint8Array(dekBuf);

  // 4. Decrypt body
  const aesKey = await crypto.subtle.importKey("raw", dek as BufferSource, "AES-GCM", false, ["decrypt"]);
  const ctCombined = new Uint8Array(base64.decode(envelope.ciphertext).length + base64.decode(envelope.authTag).length);
  ctCombined.set(base64.decode(envelope.ciphertext), 0);
  ctCombined.set(base64.decode(envelope.authTag), base64.decode(envelope.ciphertext).length);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64.decode(envelope.iv) as BufferSource },
    aesKey,
    ctCombined as BufferSource
  );
  return dec.decode(pt);
}
