import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "@ui/shared-types";

interface MessagesState {
  byMailbox: Record<string, Message[]>;
  selected: string | null;
  loading: boolean;
}

const initialState: MessagesState = {
  byMailbox: {},
  selected: null,
  loading: false,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ mailbox: string; messages: Message[] }>) => {
      state.byMailbox[action.payload.mailbox] = action.payload.messages;
    },
    appendMessage: (state, action: PayloadAction<{ mailbox: string; message: Message }>) => {
      const list = state.byMailbox[action.payload.mailbox] ?? [];
      state.byMailbox[action.payload.mailbox] = [action.payload.message, ...list];
    },
    selectMessage: (state, action: PayloadAction<string | null>) => {
      state.selected = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setMessages, appendMessage, selectMessage, setLoading } = messagesSlice.actions;
export default messagesSlice.reducer;
