"use client";

import React, { useEffect, useState, useRef } from "react";
// dynamic import handled manually for react-quill to patch react-dom first
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotificationsPanel from "../../components/Notifications";
import { getSocket } from "../../lib/socket";
import { BACKEND_URL } from "../../lib/config";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import sanitizeHtml from "../../lib/sanitizeHtml";
import CommentEditor from "../../components/CommentEditor";

type Author = {
  _id?: string;
  id?: string;
  username?: string;
};

type Comment = {
  _id?: string;
  id?: string;
  content?: string;
  text?: string;
  author: string | Author;
  clientId?: string;
  createdAt: string | number;
  parent?: string | null;
  likesCount?: number;
  likedByCurrentUser?: boolean;
};

// using shared sanitizeHtml imported from lib

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [toast, setToast] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const { token, user } = useAuth();
  const router = useRouter();

  // auto-fill author when user is present
  useEffect(() => {
    if (user?.username) setAuthor(user.username);
  }, [user]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`${BACKEND_URL}/comments`);
        const j = await res.json();
        let list: Comment[] = [];
        if (Array.isArray(j)) list = j as Comment[];
        else if (j?.ok && Array.isArray(j.comments))
          list = j.comments as Comment[];
        // sort oldest -> newest
        list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setComments(list);
        // populate likes map and liked state if provided
        const lm: Record<string, number> = {};
        list.forEach((c) => {
          const id = c._id ?? c.id;
          if (id) {
            lm[id] = c.likesCount ?? 0;
          }
        });
        setLikesMap(lm);
      } catch {
        // Error handling - could log or show toast
      }
    }
    fetchComments();
  }, []);

  function isHtmlEmpty(html: string) {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "");
    return stripped.trim().length === 0;
  }

  useEffect(() => {
    const socket = getSocket(token || undefined);
    function onNew(comment: Comment) {
      setComments((prev) => [...prev, comment]);
      const authorName =
        typeof comment.author === "string"
          ? comment.author
          : (comment.author as Author)?.username || "Someone";
      setToast(`${authorName} commented!`);
      setTimeout(() => setToast(""), 2000);
      // scroll to bottom if the listRef exists
      setTimeout(() => {
        if (listRef.current)
          listRef.current.scrollTop = listRef.current.scrollHeight;
      }, 100);
      // update likes map for new comment
      const id = comment._id ?? comment.id;
      if (id) setLikesMap((s) => ({ ...s, [id]: comment.likesCount ?? 0 }));
    }
    socket.on("new_comment", onNew);
    function onLike(payload: { commentId: string; likesCount: number }) {
      const { commentId, likesCount } = payload || {};
      if (!commentId) return;
      setLikesMap((s) => ({ ...s, [commentId]: likesCount }));
    }
    socket.on("comment:like", onLike);
    return () => {
      socket.off("new_comment", onNew);
      socket.off("comment:like", onLike);
    };
  }, [token]);

  async function submit() {
    if (isHtmlEmpty(text)) return;
    if (!token) {
      setToast("Please sign in to post a comment");
      setTimeout(() => setToast(""), 1500);
      router.push("/login");
      return;
    }
    const base = BACKEND_URL;
    try {
      const authToken = token;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
      await fetch(`${base}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: text,
        }),
      });
      setText("");
    } catch {
      // Error handling
    }
  }

  async function toggleLike(commentId: string) {
    if (!token) {
      setToast("Please log in to like");
      setTimeout(() => setToast(""), 1500);
      return;
    }
    const base = BACKEND_URL;
    try {
      const res = await fetch(`${base}/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const j = await res.json();
      if (j?.likesCount !== undefined) {
        setLikesMap((s) => ({ ...s, [commentId]: j.likesCount }));
      }
    } catch {
      // Error handling
    }
  }

  async function submitReply(parentId: string) {
    const bodyText = replyText;
    if (isHtmlEmpty(bodyText)) return;
    if (!token) {
      setToast("Please log in to reply");
      setTimeout(() => setToast(""), 1500);
      return;
    }
    const base = BACKEND_URL;
    try {
      await fetch(`${base}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: bodyText,
          parentId,
        }),
      });
      setReplyText("");
      setReplyingTo(null);
    } catch {
      // Error handling
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] flex items-start justify-center px-2 sm:px-4">
      <div className="w-full max-w-4xl">
        <Header />
        <div className="bg-white rounded-xl shadow p-3 sm:p-4">
          <NotificationsPanel />
          <h1 className="text-xl sm:text-2xl font-bold">Comments</h1>
          <div className="grid gap-3 mt-3">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="border border-gray-200 rounded-md p-2 text-sm sm:text-base"
            />
            <div>
              <CommentEditor
                value={text}
                onChange={(v) => setText(v)}
                placeholder="Write a comment..."
              />
            </div>
            <button
              onClick={submit}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer text-sm sm:text-base hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Separate card for comment list with same visual style - this card will scroll */}
        <div
          className="bg-white rounded-xl shadow p-3 sm:p-4 mt-4 comments-card mb-6"
          ref={listRef}
        >
          <h2 className="text-base sm:text-lg font-semibold">All comments</h2>
          <div className="comments-list">
            {/* group replies under their parent */}
            {(() => {
              const byParent: Record<string, Comment[]> = {};
              const top: Comment[] = [];
              comments.forEach((c) => {
                const id = c._id ?? c.id;
                const parent = c.parent ?? null;
                if (parent && id) {
                  byParent[parent] = byParent[parent] || [];
                  byParent[parent].push(c);
                } else if (id) {
                  top.push(c);
                }
              });

              return top.map((c) => {
                const id = c._id ?? c.id;
                if (!id) return null;
                const created = new Date(c.createdAt).toLocaleString();
                const authorObj = c.author;
                let authorName =
                  typeof authorObj === "string"
                    ? authorObj
                    : (authorObj as Author)?.username || "Unknown";
                authorName = (authorName || "").toString().trim() || "Unknown";
                const authorId =
                  typeof authorObj === "string"
                    ? undefined
                    : (authorObj as Author)?._id || (authorObj as Author)?.id;
                // Show rounded avatar with first letter (safe)
                const avatarLetter = (authorName[0] || "?")
                  .toString()
                  .toUpperCase();
                return (
                  <div key={id} className="mb-3">
                    <div className="bg-white p-2 sm:p-3 rounded-md shadow-sm comment-card">
                      <div className="text-xs text-gray-500">{created}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold uppercase">
                          {avatarLetter}
                        </div>
                        {authorId ? (
                          <Link
                            href={`/users/${authorId}`}
                            className="text-blue-600 hover:underline text-sm sm:text-base"
                          >
                            {authorName}
                          </Link>
                        ) : (
                          <span className="text-sm sm:text-base">
                            {authorName}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm sm:text-base">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml((c.content ?? c.text) || ""),
                          }}
                        />
                      </div>

                      <div className="mt-2 flex gap-2 items-center flex-wrap">
                        <button
                          onClick={() => toggleLike(id)}
                          className="px-2 py-1 rounded bg-gray-100 cursor-pointer text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                        >
                          👍 {likesMap[id] ?? 0}
                        </button>
                        <button
                          onClick={() => setReplyingTo(id)}
                          className="px-2 py-1 rounded bg-gray-100 cursor-pointer text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                        >
                          Reply
                        </button>
                      </div>

                      {replyingTo === id && (
                        <div className="mt-2">
                          <div>
                            <CommentEditor
                              value={replyText}
                              onChange={(v) => setReplyText(v)}
                              placeholder="Write a reply..."
                            />
                          </div>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            <button
                              onClick={() => submitReply(id)}
                              className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                            >
                              Send reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* render replies for this comment */}
                    <div className="ml-2 sm:ml-4 mt-2">
                      {(byParent[id] || []).map((r: Comment) => {
                        const rid = r._id ?? r.id;
                        if (!rid) return null;
                        const rCreated = new Date(r.createdAt).toLocaleString();
                        const rAuthorObj = r.author;
                        const rAuthor =
                          typeof rAuthorObj === "string"
                            ? rAuthorObj
                            : (rAuthorObj as Author)?.username || "Unknown";
                        const rAuthorId =
                          typeof rAuthorObj === "string"
                            ? undefined
                            : (rAuthorObj as Author)?._id ||
                              (rAuthorObj as Author)?.id;
                        const rAuthorName =
                          (rAuthor || "").toString().trim() || "Unknown";
                        const rAvatarLetter = (rAuthorName[0] || "?")
                          .toString()
                          .toUpperCase();
                        return (
                          <div
                            key={rid}
                            className="comment-card bg-gray-50 p-2 rounded-md"
                            style={{ marginTop: 8 }}
                          >
                            <div className="text-xs text-gray-500">
                              {rCreated}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase text-xs">
                                {rAvatarLetter}
                              </div>

                              {rAuthorId ? (
                                <Link
                                  href={`/users/${rAuthorId}`}
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  {rAuthor}
                                </Link>
                              ) : (
                                <span className="text-sm">{rAuthor}</span>
                              )}
                            </div>
                            <div style={{ marginTop: 6 }} className="text-sm">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(
                                    (r.content ?? r.text) || ""
                                  ),
                                }}
                              />
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <button
                                onClick={() => toggleLike(rid)}
                                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors text-xs"
                                style={{ padding: "4px 6px" }}
                              >
                                👍 {likesMap[rid] ?? 0}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-4 right-4 bg-white p-3 rounded shadow-lg border text-sm sm:text-base max-w-xs">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
