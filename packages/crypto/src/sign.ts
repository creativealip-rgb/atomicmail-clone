/**
 * Ed25519 sign / verify using WebCrypto (Node 22+ and modern browsers).
 */
import { base64 } from "./keypair.js";

async function importEd25519Public(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    raw as BufferSource,
    { name: "Ed25519" },
    false,
    ["verify"]
  );
}

async function importEd25519Private(pkcs8: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "pkcs8",
    pkcs8 as BufferSource,
    { name: "Ed25519" },
    false,
    ["sign"]
  );
}

export async function sign(privateKeyB64: string, message: Uint8Array): Promise<Uint8Array> {
  const key = await importEd25519Private(base64.decode(privateKeyB64));
  const sig = await crypto.subtle.sign({ name: "Ed25519" }, key, message as BufferSource);
  return new Uint8Array(sig);
}

export async function verify(
  publicKeyB64: string,
  message: Uint8Array,
  signature: Uint8Array
): Promise<boolean> {
  const key = await importEd25519Public(base64.decode(publicKeyB64));
  return crypto.subtle.verify(
    { name: "Ed25519" },
    key,
    signature as BufferSource,
    message as BufferSource
  );
}
