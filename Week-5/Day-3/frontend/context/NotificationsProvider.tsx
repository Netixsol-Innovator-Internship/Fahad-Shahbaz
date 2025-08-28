"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSocket } from "../lib/socket";
import { useAuth } from "./AuthContext";

type NotificationItem = {
  _id: string;
  type: string;
  actor: { _id?: string; username?: string; avatarUrl?: string } | string;
  target: string | null;
  read: boolean;
  data: any;
  createdAt: string;
};

type NotifCtx = {
  items: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotifCtx>({
  items: [],
  unreadCount: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  markRead: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  markAllRead: async () => {},
});

export function useNotifications() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }

    let mounted = true;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    (async () => {
      try {
        const res = await fetch(`${base}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const j = await res.json();
        if (!mounted) return;
        if (j?.ok && Array.isArray(j.notifications)) setItems(j.notifications);
        else if (Array.isArray(j)) setItems(j);
      } catch (e) {
        // ignore
      }
    })();

    const socket = getSocket(token || undefined);
    function onNew(n: any) {
      setItems((s) => [n, ...s]);
    }
    socket.on("notification:new", onNew);

    return () => {
      mounted = false;
      try {
        socket.off("notification:new", onNew);
      } catch (e) {}
    };
  }, [token]);

  const markRead = useCallback(
    async (id: string) => {
      if (!token) return;
      const base =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      try {
        await fetch(`${base}/notifications/${id}/read`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems((s) =>
          s.map((it) => (it._id === id ? { ...it, read: true } : it))
        );
      } catch (e) {}
    },
    [token]
  );

  const markAllRead = useCallback(async () => {
    if (!token) return;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    try {
      await fetch(`${base}/notifications/read-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((s) => s.map((it) => ({ ...it, read: true })));
    } catch (e) {}
  }, [token]);

  const unreadCount = items.reduce((acc, it) => acc + (it.read ? 0 : 1), 0);

  return (
    <NotificationsContext.Provider
      value={{ items, unreadCount, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsProvider;
