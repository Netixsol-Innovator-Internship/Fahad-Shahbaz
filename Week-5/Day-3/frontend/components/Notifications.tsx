"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "../context/NotificationsProvider";
import sanitizeHtml from "../lib/sanitizeHtml";

type NotificationItem = {
  _id: string;
  type: string;
  // actor can be a populated object from the backend or just an id string
  actor: { _id?: string; username?: string; avatarUrl?: string } | string;
  target: string | null;
  read: boolean;
  data: {
    message?: string;
    snippet?: string;
    commentText?: string;
  };
  createdAt: string;
};

export default function NotificationsPanel() {
  const { items, markRead } = useNotifications();
  // using shared sanitizeHtml
  // show a transient toast for the latest notification when items change
  const [toastVisible, setToastVisible] = useState(false);
  const [toastItem, setToastItem] = useState<NotificationItem | null>(null);
  const lastLen = React.useRef<number>(items?.length ?? 0);
  const dismissedIds = React.useRef<Set<string>>(new Set());

  // load dismissed ids from sessionStorage so dismissals persist across navigation
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("dismissedNotifs")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        dismissedIds.current = new Set(parsed || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const len = items?.length ?? 0;
    if (len === 0) return;
    // new item arrived at front
    if (len > (lastLen.current || 0)) {
      // find the first unread, not-yet-dismissed notification
      const newest = items.find(
        (it) => !it.read && !dismissedIds.current.has(it._id)
      );
      if (!newest) {
        lastLen.current = len;
        return;
      }
      setToastItem(newest);
      setToastVisible(true);
      // auto-hide after 4s
      const t = setTimeout(() => setToastVisible(false), 4000);
      // mark lastLen to current so we don't re-evaluate the same addition repeatedly
      lastLen.current = len;
      return () => clearTimeout(t);
    }
    lastLen.current = len;
  }, [items]);

  const router = useRouter();

  if (!toastVisible || !toastItem) return null;

  return (
    <div className="fixed right-2 sm:right-5 top-5 w-72 sm:w-80 z-50 mx-2 sm:mx-0">
      <div className={`notif-item ${!toastItem.read ? "unread" : ""}`}>
        <div className="flex justify-between">
          <div className="small muted">
            {new Date(toastItem.createdAt).toLocaleString()}
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => {
                setToastVisible(false);
                // remember dismissed id so toast won't reappear
                try {
                  dismissedIds.current.add(toastItem._id);
                  if (typeof window !== "undefined") {
                    window.sessionStorage.setItem(
                      "dismissedNotifs",
                      JSON.stringify(Array.from(dismissedIds.current))
                    );
                  }
                } catch {}
                // mark read when user dismisses
                markRead(toastItem._id).catch(() => {});
              }}
              className="border-0 bg-transparent cursor-pointer text-xs sm:text-sm"
            >
              ✕
            </button>
            <button
              onClick={() => {
                setToastVisible(false);
                // navigate to full notifications page
                router.push("/notifications");
              }}
              className="border-0 bg-transparent cursor-pointer text-blue-600 text-xs sm:text-sm"
            >
              View all
            </button>
          </div>
        </div>
        <div className="font-semibold mt-1.5 text-sm sm:text-base">
          {(() => {
            const actorObj = toastItem.actor;
            const actorName =
              actorObj && typeof actorObj === "object"
                ? actorObj.username || "Someone"
                : typeof actorObj === "string"
                ? actorObj
                : "Someone";

            // For reply notifications, show only name and message
            if (toastItem.type === "reply") {
              return `${actorName}`;
            }
            if (toastItem.type === "comment") return `${actorName} commented`;
            if (toastItem.type === "like")
              return `${actorName} liked your comment`;
            return toastItem.type;
          })()}
        </div>
        <div
          className="muted small text-xs sm:text-sm"
          style={{ marginTop: 6 }}
        >
          {toastItem.type === "reply" ? (
            <>{toastItem.data?.message || "Replied to your comment"}</>
          ) : toastItem.type === "comment" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  (toastItem.data?.snippet as string) ||
                    (toastItem.data?.commentText as string) ||
                    ""
                ),
              }}
            />
          ) : toastItem.type === "like" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml((toastItem.data?.snippet as string) || ""),
              }}
            />
          ) : typeof toastItem.data === "string" ? (
            <>{toastItem.data}</>
          ) : (
            <>{JSON.stringify(toastItem.data)}</>
          )}
        </div>
      </div>
    </div>
  );
}
