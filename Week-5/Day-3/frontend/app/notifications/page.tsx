"use client";

import React from "react";
import { useNotifications } from "../../context/NotificationsProvider";
import sanitizeHtml from "../../lib/sanitizeHtml";

export default function NotificationsPage() {
  const { items, markRead, markAllRead } = useNotifications();

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] flex items-start justify-center">
      <div className="app-container">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="title">Notifications</h1>
            <div>
              <button className="btn secondary" onClick={() => markAllRead()}>
                Mark all read
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {items.length === 0 && (
              <div className="muted">No notifications</div>
            )}
            {items.map((it) => (
              <div
                key={it._id}
                className={`notif-item ${!it.read ? "unread" : ""}`}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="small muted">
                    {new Date(it.createdAt).toLocaleString()}
                  </div>
                  {!it.read && (
                    <button
                      onClick={() => markRead(it._id)}
                      className="btn secondary"
                      style={{ padding: "4px 8px" }}
                    >
                      Mark
                    </button>
                  )}
                </div>
                <div style={{ fontWeight: 600, marginTop: 6 }}>
                  {(() => {
                    const actor = it.actor as
                      | { username?: string }
                      | string
                      | undefined;
                    const name =
                      actor && typeof actor === "object"
                        ? actor.username || "Someone"
                        : typeof actor === "string"
                        ? actor
                        : "Someone";
                    if (it.type === "comment") return `${name} commented`;
                    if (it.type === "like") return `${name} liked your comment`;
                    return it.type;
                  })()}
                </div>
                <div className="muted small" style={{ marginTop: 6 }}>
                  {it.type === "comment" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(
                          (it.data?.snippet as string) ||
                            (it.data?.commentText as string) ||
                            ""
                        ),
                      }}
                    />
                  ) : it.type === "like" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(
                          (it.data?.snippet as string) || ""
                        ),
                      }}
                    />
                  ) : typeof it.data === "string" ? (
                    <>{it.data}</>
                  ) : (
                    <>{JSON.stringify(it.data)}</>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
