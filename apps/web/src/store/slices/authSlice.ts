import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { saveKeyMaterial, unlockKeyMaterial, getUnlockedKey, lockKeyMaterial, type KeyMaterialBlob } from "../../services/crypto/vault";

interface User {
  id: string;
  email: string;
  createdAt: string;
  publicKey?: string | null;
}

interface KeyMaterialResponse {
  ecdhPublicKey: string;
  signPublicKey?: string;
  encryptedPrivateKey: { ciphertext: string; iv: string; salt: string };
  recoveryCode?: string;  // only present on sign-up
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  demoMode: boolean;
  /** Server-issued encrypted private key blob (needed to unlock keys after sign-in) */
  keyMaterial: KeyMaterialBlob | null;
  /** Did we decrypt the private key with the password yet? */
  keyUnlocked: boolean;
  /** One-time recovery phrase (sign-up only) */
  recoveryCode: string | null;
}

const TOKEN_KEY = "chainmail.access";
const REFRESH_KEY = "chainmail.refresh";

function readPersisted(): { access: string | null; refresh: string | null } {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

function persist(access: string | null, refresh: string | null) {
  if (typeof window === "undefined") return;
  if (access) localStorage.setItem(TOKEN_KEY, access);
  else localStorage.removeItem(TOKEN_KEY);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  else localStorage.removeItem(REFRESH_KEY);
}

interface SignUpResp {
  user: User;
  accessToken: string;
  refreshToken: string;
  keyMaterial?: KeyMaterialResponse;
}
interface SignInResp {
  user: User;
  accessToken: string;
  refreshToken: string;
  keyMaterial?: { ecdhPublicKey: string; encryptedPrivateKey: { ciphertext: string; iv: string; salt: string } } | null;
}

export const signUp = createAsyncThunk<
  SignUpResp & { recoveryCode: string | null; keyMaterialBlob: KeyMaterialBlob | null },
  { email: string; password: string },
  { rejectValue: string }
>("auth/signUp", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return rejectWithValue(body?.error ?? `sign-up failed (${res.status})`);
    }
    const data = (await res.json()) as SignUpResp;
    persist(data.accessToken, data.refreshToken);

    // W3.5: persist key material in IndexedDB (encrypted blob is safe at rest)
    let keyMaterialBlob: KeyMaterialBlob | null = null;
    let recoveryCode: string | null = null;
    if (data.keyMaterial) {
      const blob: KeyMaterialBlob = {
        ecdhPublicKey: data.keyMaterial.ecdhPublicKey,
        signPublicKey: data.keyMaterial.signPublicKey ?? "",
        encryptedPrivateKey: data.keyMaterial.encryptedPrivateKey,
      };
      await saveKeyMaterial(data.user.id, blob);
      keyMaterialBlob = blob;
      recoveryCode = data.keyMaterial.recoveryCode ?? null;
    }

    return { ...data, keyMaterialBlob, recoveryCode };
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : "network error");
  }
});

export const signIn = createAsyncThunk<
  SignInResp & { keyMaterialBlob: KeyMaterialBlob | null },
  { email: string; password: string },
  { rejectValue: string }
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return rejectWithValue(body?.error ?? `sign-in failed (${res.status})`);
    }
    const data = (await res.json()) as SignInResp;
    persist(data.accessToken, data.refreshToken);

    // W3.5: server returns the encrypted private key blob. We need the password
    // to decrypt it — but it was just used for sign-in, so unlock now.
    let keyMaterialBlob: KeyMaterialBlob | null = null;
    if (data.keyMaterial) {
      keyMaterialBlob = {
        ecdhPublicKey: data.keyMaterial.ecdhPublicKey,
        signPublicKey: "",
        encryptedPrivateKey: data.keyMaterial.encryptedPrivateKey,
      };
      await saveKeyMaterial(data.user.id, keyMaterialBlob);
      // Try to unlock — if password is wrong, this fails silently
      await unlockKeyMaterial(data.user.id, password);
    }
    return { ...data, keyMaterialBlob };
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : "network error");
  }
});

export const unlockKeys = createAsyncThunk<
  boolean,
  { password: string },
  { rejectValue: string; state: { auth: AuthState } }
>("auth/unlockKeys", async ({ password }, { getState, rejectWithValue }) => {
  const { user } = getState().auth;
  if (!user) return rejectWithValue("not signed in");
  const kp = await unlockKeyMaterial(user.id, password);
  if (!kp) return rejectWithValue("wrong password");
  return true;
});

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    const token = readPersisted().access;
    if (!token) return rejectWithValue("no token");
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return rejectWithValue(`me failed (${res.status})`);
      const data = (await res.json()) as { user: User };
      return data.user;
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "network error");
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
  demoMode: false,
  keyMaterial: null,
  keyUnlocked: false,
  recoveryCode: null,
};

const { access, refresh } = readPersisted();
if (access) {
  initialState.isAuthenticated = true;
  initialState.accessToken = access;
  initialState.refreshToken = refresh;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state) => {
      persist(null, null);
      // W3.5: also lock the in-memory key cache
      if (state.user) {
        void lockKeyMaterial(state.user.id);
      }
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      state.keyMaterial = null;
      state.keyUnlocked = false;
      state.recoveryCode = null;
    },
    setDemoMode: (state, action: PayloadAction<boolean>) => {
      state.demoMode = action.payload;
    },
    /** Demo-only: fake an authenticated session without API call. */
    signInSuccess: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.user = { id: "demo", email: action.payload.email, createdAt: new Date().toISOString() };
      state.accessToken = action.payload.token;
      state.refreshToken = null;
      state.demoMode = true;
      state.keyUnlocked = true;
    },
    /** Clear the one-time recovery code (after user has saved it) */
    clearRecoveryCode: (state) => {
      state.recoveryCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(signUp.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
        s.demoMode = false;
        s.keyMaterial = a.payload.keyMaterialBlob;
        s.recoveryCode = a.payload.recoveryCode;
        s.keyUnlocked = true; // we just set the password, so unlock succeeds
      })
      .addCase(signUp.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? a.error.message ?? "sign-up failed";
      })
      .addCase(signIn.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(signIn.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
        s.demoMode = false;
        s.keyMaterial = a.payload.keyMaterialBlob;
        s.keyUnlocked = true;
      })
      .addCase(signIn.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? a.error.message ?? "sign-in failed";
      })
      .addCase(unlockKeys.fulfilled, (s) => {
        s.keyUnlocked = true;
      })
      .addCase(unlockKeys.rejected, (s, a) => {
        s.error = a.payload ?? "unlock failed";
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (s) => {
        persist(null, null);
        s.isAuthenticated = false;
        s.user = null;
        s.accessToken = null;
        s.refreshToken = null;
      });
  },
});

export const { signOut, setDemoMode, signInSuccess, clearRecoveryCode } = authSlice.actions;
export default authSlice.reducer;

// Helper: check if the current user has their decryption key in memory
export function selectKeyUnlocked(state: { auth: AuthState }): boolean {
  return state.auth.keyUnlocked || state.auth.demoMode;
}

// Helper: synchronously look up the unlocked keypair (used in components)
export async function loadUnlockedKey(userId: string) {
  return getUnlockedKey(userId);
}
