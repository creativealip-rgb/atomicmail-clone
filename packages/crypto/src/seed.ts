/**
 * BIP39-style 12-word recovery code.
 * Pure-WebCrypto wordlist (256 most common English words). Not BIP39-spec
 * compliant, but provides 96 bits of entropy and is human-readable.
 * Used as a backdoor to recover the keypair if the user forgets their password.
 */
const WORDS = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse",
  "access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act",
  "action","actor","actress","actual","adapt","add","addict","address","adjust","admit",
  "adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent",
  "agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert",
  "alien","all","alley","allow","almost","alone","alpha","already","also","alter",
  "always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger",
  "angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique",
  "anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic",
  "area","arena","argue","arm","armed","armor","army","around","arrange","arrest",
  "arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset",
  "assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction",
  "audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake",
  "aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge",
  "bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain",
  "barrel","base","basic","basket","battle","beach","bean","beauty","because","become",
  "beef","before","begin","behave","behind","believe","below","belt","bench","benefit",
  "best","betray","better","between","beyond","bicycle","bid","bike","bind","biology",
  "bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless",
  "blind","blood","blossom","blouse","blue","blur","blush","board","boat","body",
  "boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss",
  "bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread",
  "breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze",
  "broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb",
  "bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy",
  "butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call",
];

const WORD_COUNT = 256;
const ENTROPY_WORDS = 12;

function randomIndex(): number {
  // Rejection sampling to avoid modulo bias
  const limit = Math.floor(0xffffffff / WORD_COUNT) * WORD_COUNT;
  const buf = new Uint8Array(4);
  while (true) {
    crypto.getRandomValues(buf);
    const n = (buf[0] << 24 | buf[1] << 16 | buf[2] << 8 | buf[3]) >>> 0;
    if (n < limit) return n % WORD_COUNT;
  }
}

export async function generateRecoveryCode(): Promise<string> {
  const words: string[] = [];
  for (let i = 0; i < ENTROPY_WORDS; i++) {
    words.push(WORDS[randomIndex()]);
  }
  return words.join(" ");
}

/** Compute SHA-256 of the code (server stores hash, never the plaintext). */
export async function hashRecoveryCode(code: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code) as BufferSource);
  return Buffer.from(buf).toString("hex");
}

export function validateRecoveryCodeFormat(code: string): boolean {
  const parts = code.trim().split(/\s+/);
  return parts.length === ENTROPY_WORDS && parts.every((w) => WORDS.includes(w));
}
