/**
 * BIP39 12-word seed phrase generation + validation
 */
export async function generateSeedPhrase(_strength = 128): Promise<string[]> {
  throw new Error("generateSeedPhrase not implemented — install @scure/bip39");
}

export async function seedToKey(_words: string[]): Promise<Uint8Array> {
  throw new Error("seedToKey not implemented");
}

export function validateSeedPhrase(_words: string[]): boolean {
  throw new Error("validateSeedPhrase not implemented");
}
