import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io("https://realtimebackend.vercel.app", {
      transports: ["websocket"],
      withCredentials: true,
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
    });
  }
  return socket;
}
