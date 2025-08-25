import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL!.replace(/^http/, "ws"), {
      transports: ["websocket"],
      withCredentials: true,
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
    });
  }
  return socket;
}
