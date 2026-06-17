import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ComposerState {
  open: boolean;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string; // HTML
  encryption: "atomic" | "password" | "file";
  password: string | null;
  expiresAt: number | null; // epoch ms
  attachments: { id: string; name: string; size: number; type: string }[];
  draftId: string | null;
}

const initialState: ComposerState = {
  open: false,
  to: [],
  cc: [],
  bcc: [],
  subject: "",
  body: "",
  encryption: "atomic",
  password: null,
  expiresAt: null,
  attachments: [],
  draftId: null,
};

const composerSlice = createSlice({
  name: "composer",
  initialState,
  reducers: {
    open: (state) => {
      state.open = true;
    },
    close: () => initialState,
    update: (state, action: PayloadAction<Partial<ComposerState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { open, close, update } = composerSlice.actions;
export default composerSlice.reducer;
