import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@ui/shared-types";

interface UserState {
  profile: User | null;
  plan: "free" | "plus";
  twoFactorEnabled: boolean;
  localLLMEnabled: boolean;
  securityHelperEnabled: boolean;
  theme: "light" | "dark" | "system";
}

const initialState: UserState = {
  profile: null,
  plan: "free",
  twoFactorEnabled: false,
  localLLMEnabled: false,
  securityHelperEnabled: false,
  theme: "system",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setPlan: (state, action: PayloadAction<"free" | "plus">) => {
      state.plan = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
  },
});

export const { setProfile, setPlan, setTheme } = userSlice.actions;
export default userSlice.reducer;
