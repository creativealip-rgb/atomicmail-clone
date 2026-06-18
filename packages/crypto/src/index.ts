/**
 * WebCrypto wrapper — isomorphic (browser + Node 20+ with --experimental-webcrypto)
 *
 * Pipeline (per struktur.md section 8):
 *   - KEM:    X25519 ECDH → HKDF
 *   - Sign:   Ed25519
 *   - Sym:    AES-GCM-256
 *   - KDF:    PBKDF2 (WebCrypto native)
 *
 * Uses ONLY WebCrypto APIs — works in Node 22+ and all modern browsers.
 */
export * from "./keypair.js";
export * from "./kdf.js";
export * from "./encrypt.js";
export * from "./sign.js";
export * from "./ecdh.js";
export * from "./seed.js";
export * from "./password-decrypt.js";
export * from "./envelope.js";
