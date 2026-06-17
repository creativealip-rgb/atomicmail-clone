/**
 * KDF — scrypt (preferred) and pbkdf2
 * Used to derive the KEK (Key Encryption Key) from user password
 *
 * Recommended scrypt params: N=2^14, r=8, p=1
 * Recommended pbkdf2 params: 100k iterations, SHA-256
 */

const SCRYPT_N = 1 << 14; // 16384
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;

export async function deriveKeyScrypt(
  password: string,
  salt: Uint8Array
): Promise<Uint8Array> {
  // Use WebCrypto SubtleCrypto via scrypt fallback
  // (WebCrypto doesn't support scrypt natively — use @noble/hashes/scrypt)
  throw new Error("deriveKeyScrypt not implemented — install @noble/hashes");
}

export async function deriveKeyPbkdf2(
  password: string,
  salt: Uint8Array,
  iterations = 100_000
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password) as BufferSource,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    KEY_LEN * 8
  );
  return new Uint8Array(bits);
}
