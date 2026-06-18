/**
 * Socket.IO middleware — connects when authenticated, dispatches actions on events
 */
import type { Middleware } from "@reduxjs/toolkit";
import { io, type Socket } from "socket.io-client";
import { setMessages, appendMessage } from "@/store/slices/messagesSlice";
import { setUnread as setFolderUnread } from "@/store/slices/foldersSlice";
import { push } from "@/store/slices/notificationsSlice";

const WS_URL = import.meta.env.VITE_WS_URL ?? "wss://ws.chainmail.app";

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Connect on auth success (action string match — replace with RTK listener pattern in prod)
  if (typeof action === "object" && action !== null && "type" in action) {
    const type = (action as { type: string }).type;
    if (type === "auth/signInSuccess" && !socket) {
      socket = io(WS_URL, {
        path: "/engine.io",
        transports: ["websocket"],
        withCredentials: true,
      });
      socket.on("message:new", (msg: unknown) => {
        store.dispatch(appendMessage({ mailbox: "inbox", message: msg as never }));
        store.dispatch(push({ type: "info", message: "New message" }));
      });
      socket.on("folder:unread", (data: { id: string; count: number }) => {
        store.dispatch(setFolderUnread(data));
      });
    }
    if (type === "auth/signOut" && socket) {
      socket.disconnect();
      socket = null;
    }
  }

  return result;
};
