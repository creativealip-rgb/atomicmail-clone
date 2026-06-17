import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import messagesReducer from "@/store/slices/messagesSlice";
import foldersReducer from "@/store/slices/foldersSlice";
import aliasesReducer from "@/store/slices/aliasesSlice";
import encryptionReducer from "@/store/slices/encryptionSlice";
import composerReducer from "@/store/slices/composerSlice";
import userReducer from "@/store/slices/userSlice";
import uiReducer from "@/store/slices/uiSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";
import { socketMiddleware } from "@/store/middleware/socketMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    folders: foldersReducer,
    aliases: aliasesReducer,
    encryption: encryptionReducer,
    composer: composerReducer,
    user: userReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        // crypto binary data not serializable
        ignoredActions: ["encryption/setKeypair"],
        ignoredPaths: ["encryption.keypair"],
      },
    }).concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
