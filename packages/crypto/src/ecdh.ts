/**
 * ECDH key agreement on X25519, then HKDF to derive AES key
 * Pure WebCrypto — works in Node 22+ and all modern browsers.
 */
import { base64 } from "./keypair.js";

const enc = new TextEncoder();

async function importX25519Public(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", raw as BufferSource, { name: "X25519" }, false, []);
}

async function importX25519Private(pkcs8: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey("pkcs8", pkcs8 as BufferSource, { name: "X25519" }, false, ["deriveBits"]);
}

/** Derive 32-byte shared secret from (my private key, their public key). */
export async function ecdhSharedSecret(
  myPrivateKeyB64: string,
  theirPublicKeyB64: string
): Promise<Uint8Array> {
  const priv = await importX25519Private(base64.decode(myPrivateKeyB64));
  const pub = await importX25519Public(base64.decode(theirPublicKeyB64));
  const bits = await crypto.subtle.deriveBits(
    { name: "X25519", public: pub } as any,
    priv,
    256
  );
  return new Uint8Array(bits);
}

/** HKDF-SHA256 — derive AES key from shared secret + context info. */
export async function hkdfDerive(
  sharedSecret: Uint8Array,
  info: string,
  length = 32
): Promise<Uint8Array> {
  const ikm = await crypto.subtle.importKey(
    "raw",
    sharedSecret as BufferSource,
    "HKDF",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0) as BufferSource,
      info: enc.encode(info) as BufferSource,
    },
    ikm,
    length * 8
  );
  return new Uint8Array(bits);
}

/** High-level: derive a 32-byte AES-GCM key. */
export async function deriveAesKey(
  sharedSecret: Uint8Array,
  info: string
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    sharedSecret as BufferSource,
    "HKDF",
    false,
    ["deriveKey"]
  ).then(async (ikm) => {
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array(0) as BufferSource,
        info: enc.encode(info) as BufferSource,
      },
      ikm,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  });
}
