/**
 * Password-protected encryption — for /app/encrypted/:key
 *
 * Used for sending to external recipients (non-Atomic-Mail users).
 * The :key is server-stored ciphertext reference. Recipient enters password to decrypt.
 */
import { deriveKeyScrypt } from "./kdf";
import { aesDecrypt } from "./encrypt";

export async function decryptWithPassword(
  _ciphertextRef: string,
  _password: string
): Promise<string> {
  // 1. Fetch ciphertext from /api/encrypted/:key
  // 2. Derive AES key from password + salt (scrypt)
  // 3. Decrypt body
  // 4. Return HTML
  throw new Error("decryptWithPassword not implemented — needs API + scrypt");
}
