/**
 * Ed25519 sign/verify
 */
export async function sign(_privateKey: string, _message: Uint8Array): Promise<Uint8Array> {
  throw new Error("sign not implemented — install @noble/ed25519 or use WebCrypto subtle.sign with Ed25519");
}

export async function verify(
  _publicKey: string,
  _message: Uint8Array,
  _signature: Uint8Array
): Promise<boolean> {
  throw new Error("verify not implemented");
}
