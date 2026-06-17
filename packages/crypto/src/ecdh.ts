/**
 * ECDH key exchange on secp256k1, then HKDF to derive AES key
 */
export async function ecdhSharedSecret(
  _privateKey: string,
  _publicKey: string
): Promise<Uint8Array> {
  throw new Error("ecdhSharedSecret not implemented — install @noble/secp256k1");
}

export async function hkdfDerive(
  _sharedSecret: Uint8Array,
  _info: string,
  length = 32
): Promise<Uint8Array> {
  // Use WebCrypto HKDF
  const ikm = await crypto.subtle.importKey("raw", _sharedSecret as BufferSource, "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0) as BufferSource,
      info: new TextEncoder().encode(_info) as BufferSource,
    },
    ikm,
    length * 8
  );
  return new Uint8Array(bits);
}
