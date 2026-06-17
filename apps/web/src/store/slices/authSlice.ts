import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  twoFactorRequired: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  token: null,
  twoFactorRequired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInSuccess: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.twoFactorRequired = false;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.token = null;
      state.twoFactorRequired = false;
    },
    require2FA: (state) => {
      state.twoFactorRequired = true;
    },
  },
});

export const { signInSuccess, signOut, require2FA } = authSlice.actions;
export default authSlice.reducer;
