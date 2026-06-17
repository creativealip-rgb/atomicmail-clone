/**
 * AES-GCM-256 symmetric encryption
 */
export async function aesEncrypt(
  key: Uint8Array,
  iv: Uint8Array,
  plaintext: string
): Promise<{ ciphertext: Uint8Array; authTag: Uint8Array }> {
  const cryptoKey = await crypto.subtle.importKey("raw", key as BufferSource, "AES-GCM", false, ["encrypt"]);
  const enc = new TextEncoder();
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    cryptoKey,
    enc.encode(plaintext) as BufferSource
  );
  // AES-GCM output = ciphertext + 16-byte tag (last 16 bytes)
  const ctBytes = new Uint8Array(ct);
  const ciphertext = ctBytes.slice(0, -16);
  const authTag = ctBytes.slice(-16);
  return { ciphertext, authTag };
}

export async function aesDecrypt(
  key: Uint8Array,
  iv: Uint8Array,
  ciphertext: Uint8Array,
  authTag: Uint8Array
): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey("raw", key as BufferSource, "AES-GCM", false, ["decrypt"]);
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext, 0);
  combined.set(authTag, ciphertext.length);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    cryptoKey,
    combined as BufferSource
  );
  return new TextDecoder().decode(pt);
}
