import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentToken: string | undefined = undefined;

export function getSocket(token?: string): Socket {
  // If a socket exists but the token changed, reconnect
  if (socket && token !== currentToken) {
    try {
      socket.disconnect();
    } catch (e) {
      // ignore
    }
    socket = null;
  }

  if (!socket) {
    currentToken = token;
    socket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
      {
        // allow polling fallback so the socket can connect reliably in dev
        // environments and behind proxies that block direct websocket
        // upgrades. Removing `transports: ['websocket']` lets the client
        // negotiate the best transport.
        auth: token ? { token } : undefined,
        withCredentials: true,
        reconnection: true,
      }
    );
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    try {
      socket.disconnect();
    } catch (e) {
      // ignore
    }
    socket = null;
    currentToken = undefined;
  }
}
