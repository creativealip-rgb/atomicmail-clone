import type { Message } from "@ui/shared-types";
import { ecdhSharedSecret, hkdfDerive, aesDecrypt } from "@ui/crypto";

/**
 * Decrypt a message body using recipient keypair + sender's public key.
 *
 * Flow per struktur.md section 8:
 *   1. ECDH(my_priv, sender_pub) → shared secret
 *   2. HKDF → AES key
 *   3. AES-GCM decrypt body
 *   4. Verify Ed25519 signature
 */
export async function decryptMessage(
  ciphertext: Message["ciphertext"],
  keypair: { privateKey: string; signPublicKey: string }
): Promise<string> {
  if (!ciphertext) return "";

  const sharedSecret = await ecdhSharedSecret(keypair.privateKey, ciphertext.senderPubKey);
  const aesKey = await hkdfDerive(sharedSecret, "atomic-mail-msg");
  const plain = await aesDecrypt(aesKey, ciphertext.iv, ciphertext.body, ciphertext.authTag);
  return plain;
}
