import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type ToastAction = { label: string; type: "button" };

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  /** Optional action — when provided, a small button renders next to the message. */
  action?: ToastAction;
}

interface NotificationsState {
  queue: Notification[];
}

const initialState: NotificationsState = { queue: [] };

// Pending undo handlers live outside Redux state so the dispatch callback isn't
// serialized. Stored by toast id.
const undoHandlers = new Map<string, () => void>();

export function getUndoHandler(id: string): (() => void) | undefined {
  return undoHandlers.get(id);
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    push: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.queue.push(action.payload);
      },
      prepare: (input: Omit<Notification, "id"> & { onUndo?: () => void }) => {
        const { onUndo, ...rest } = input;
        const id = nanoid();
        if (onUndo) undoHandlers.set(id, onUndo);
        return { payload: { ...rest, id } };
      },
    },
    dismiss: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((n) => n.id !== action.payload);
      undoHandlers.delete(action.payload);
    },
  },
});

export const { push, dismiss } = notificationsSlice.actions;
export default notificationsSlice.reducer;
