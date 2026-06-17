/**
 * Encryption slice — holds decrypted keypair IN MEMORY ONLY
 * Never persisted to localStorage. Cleared on sign-out.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KeyPair {
  publicKey: string; // base64
  privateKey: string; // base64 — SENSITIVE
  signPublicKey: string;
  signPrivateKey: string;
}

interface EncryptionState {
  keypair: KeyPair | null;
  unlockState: "locked" | "unlocked" | "uninitialized";
}

const initialState: EncryptionState = {
  keypair: null,
  unlockState: "locked",
};

const encryptionSlice = createSlice({
  name: "encryption",
  initialState,
  reducers: {
    setKeypair: (state, action: PayloadAction<KeyPair>) => {
      state.keypair = action.payload;
      state.unlockState = "unlocked";
    },
    lock: (state) => {
      state.keypair = null;
      state.unlockState = "locked";
    },
  },
});

export const { setKeypair, lock } = encryptionSlice.actions;
export default encryptionSlice.reducer;
