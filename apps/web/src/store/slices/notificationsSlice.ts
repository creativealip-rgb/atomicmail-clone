import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  action?: { label: string; href?: string };
}

interface NotificationsState {
  queue: Notification[];
}

const initialState: NotificationsState = { queue: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    push: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.queue.push(action.payload);
      },
      prepare: (input: Omit<Notification, "id">) => ({
        payload: { ...input, id: nanoid() },
      }),
    },
    dismiss: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((n) => n.id !== action.payload);
    },
  },
});

export const { push, dismiss } = notificationsSlice.actions;
export default notificationsSlice.reducer;
