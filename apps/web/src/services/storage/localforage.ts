import localforage from "localforage";

// Matches AtomicMailDB v2 structure observed
const mainStore = localforage.createInstance({
  name: "AtomicMailClone",
  storeName: "keyvaluepairs",
  description: "Encrypted message cache + keypair blob",
});

export const storage = {
  get: <T>(key: string) => mainStore.getItem<T>(key),
  set: <T>(key: string, value: T) => mainStore.setItem<T>(key, value),
  remove: (key: string) => mainStore.removeItem(key),
  clear: () => mainStore.clear(),
};

export const StorageKeys = {
  KEYPAIR_ENCRYPTED: "keypair_encrypted",
  ENCRYPTED_SEED: "encrypted_seed_phrase",
  MESSAGE_CACHE: "message_cache",
  DRAFT: "draft",
} as const;
