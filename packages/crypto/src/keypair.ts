/**
 * Keypair generation — X25519 (ECDH) + Ed25519 (sign)
 *
 * Uses WebCrypto's native key generation (Node 22+ + all modern browsers).
 * Keys are exported as raw bytes and stored as base64.
 */

export interface KeyPair {
  /** X25519 — used for ECDH key agreement (encryption) */
  ecdhPublicKey: string;   // base64
  ecdhPrivateKey: string;  // base64
  /** Ed25519 — used for signing (future: signed receipts) */
  signPublicKey: string;   // base64
  signPrivateKey: string;  // base64
}

function b64encode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function generateKeyPair(): Promise<KeyPair> {
  // X25519 for ECDH
  const ecdhKp = (await crypto.subtle.generateKey(
    { name: "X25519" },
    true,
    ["deriveBits", "deriveKey"]
  )) as CryptoKeyPair;
  const ecdhPubRaw = await crypto.subtle.exportKey("raw", ecdhKp.publicKey);
  const ecdhPrivRaw = await crypto.subtle.exportKey("pkcs8", ecdhKp.privateKey);

  // Ed25519 for signing
  const signKp = (await crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
  )) as CryptoKeyPair;
  const signPubRaw = await crypto.subtle.exportKey("raw", signKp.publicKey);
  const signPrivRaw = await crypto.subtle.exportKey("pkcs8", signKp.privateKey);

  return {
    ecdhPublicKey: b64encode(ecdhPubRaw),
    ecdhPrivateKey: b64encode(ecdhPrivRaw),
    signPublicKey: b64encode(signPubRaw),
    signPrivateKey: b64encode(signPrivRaw),
  };
}

/** Encrypt a private keypair with a password-derived KEK (PBKDF2). */
export async function encryptKeyPair(
  kp: KeyPair,
  password: string
): Promise<{
  ciphertext: string;  // base64
  iv: string;           // base64
  salt: string;         // base64
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password) as BufferSource,
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const kek = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 200_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const payload = JSON.stringify(kp);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    kek,
    new TextEncoder().encode(payload) as BufferSource
  );

  return {
    ciphertext: b64encode(ct),
    iv: b64encode(iv),
    salt: b64encode(salt),
  };
}

export async function decryptKeyPair(
  encrypted: { ciphertext: string; iv: string; salt: string },
  password: string
): Promise<KeyPair> {
  const salt = b64decode(encrypted.salt);
  const iv = b64decode(encrypted.iv);
  const ct = b64decode(encrypted.ciphertext);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password) as BufferSource,
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  const kek = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 200_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    kek,
    ct as BufferSource
  );
  return JSON.parse(new TextDecoder().decode(pt));
}

/** Re-export base64 helpers for external use */
export const base64 = { encode: b64encode, decode: b64decode };
