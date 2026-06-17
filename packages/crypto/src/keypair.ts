/**
 * Keypair generation — Ed25519 (sign) + ECDH secp256k1 (encryption key exchange)
 *
 * TODO: implement with @noble/ed25519 + @noble/secp256k1
 */
export interface KeyPair {
  signPublicKey: string;  // base64
  signPrivateKey: string; // base64
  ecdhPublicKey: string;  // base64
  ecdhPrivateKey: string; // base64
}

export async function generateKeyPair(): Promise<KeyPair> {
  // Placeholder — replace with real implementation
  throw new Error("generateKeyPair not implemented — install @noble/curves and @noble/ed25519");
}

export function serializeKeyPair(_kp: KeyPair): string {
  throw new Error("not implemented");
}

export function deserializeKeyPair(_raw: string): KeyPair {
  throw new Error("not implemented");
}
