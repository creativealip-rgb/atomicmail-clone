import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  privacyCenterOpen: boolean;
  activeModal: string | null;
  searchQuery: string;
}

const initialState: UIState = {
  sidebarOpen: true,
  privacyCenterOpen: false,
  activeModal: null,
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setPrivacyCenter: (state, action: PayloadAction<boolean>) => {
      state.privacyCenterOpen = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleSidebar, setPrivacyCenter, setActiveModal, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
