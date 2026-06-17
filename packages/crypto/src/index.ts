/**
 * WebCrypto wrapper — isomorphic (browser + Node 20+ with --experimental-webcrypto)
 *
 * Pipeline (per struktur.md section 8):
 *   - KEM:    secp256k1 ECDH → HKDF
 *   - Sign:   Ed25519
 *   - Sym:    AES-GCM-256
 *   - KDF:    scrypt / pbkdf2
 *
 * NOTE: This is a SKELETON. For production use:
 *   - npm install @noble/secp256k1 @noble/ed25519 @noble/ciphers @noble/hashes
 *   - Or use WebCrypto with subtle.importKey for native Ed25519 (browser only)
 */
export * from "./keypair";
export * from "./kdf";
export * from "./encrypt";
export * from "./sign";
export * from "./ecdh";
export * from "./seed";
export * from "./password-decrypt";
