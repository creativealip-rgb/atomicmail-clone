import { io, type Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL ?? "wss://ws.atomicmail.io";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket) return socket;
  socket = io(WS_URL, {
    path: "/engine.io",
    transports: ["websocket"],
    auth: { token },
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
