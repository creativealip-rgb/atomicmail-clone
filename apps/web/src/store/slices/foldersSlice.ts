import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Folder } from "@ui/shared-types";

interface FoldersState {
  list: Folder[];
  active: string | null;
  unreadCounts: Record<string, number>;
}

const initialState: FoldersState = {
  list: [],
  active: null,
  unreadCounts: {},
};

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<Folder[]>) => {
      state.list = action.payload;
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    setUnread: (state, action: PayloadAction<{ id: string; count: number }>) => {
      state.unreadCounts[action.payload.id] = action.payload.count;
    },
  },
});

export const { setFolders, setActive, setUnread } = foldersSlice.actions;
export default foldersSlice.reducer;
