import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Alias } from "@ui/shared-types";

interface AliasesState {
  list: Alias[];
  limit: number;
  loading: boolean;
}

const initialState: AliasesState = {
  list: [],
  limit: 10, // free plan: 10; plus: 15
  loading: false,
};

const aliasesSlice = createSlice({
  name: "aliases",
  initialState,
  reducers: {
    setAliases: (state, action: PayloadAction<Alias[]>) => {
      state.list = action.payload;
    },
    addAlias: (state, action: PayloadAction<Alias>) => {
      state.list.push(action.payload);
    },
    removeAlias: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((a) => a.id !== action.payload);
    },
  },
});

export const { setAliases, addAlias, removeAlias } = aliasesSlice.actions;
export default aliasesSlice.reducer;
