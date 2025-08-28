"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
// dynamic import handled manually for react-quill to patch react-dom first
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotificationsPanel from "../../components/Notifications";
import { getSocket } from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import sanitizeHtml from "../../lib/sanitizeHtml";
import CommentEditor from "../../components/CommentEditor";

type Comment = {
  _id?: string;
  id?: string;
  content?: string;
  text?: string;
  author: any;
  clientId?: string;
  createdAt: string | number;
  parent?: string | null;
  likesCount?: number;
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
  const [liked, setLiked] = useState<Record<string, boolean>>({});
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
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
          }/comments`
        );
        const j = await res.json();
        let list: any[] = [];
        if (Array.isArray(j)) list = j;
        else if (j?.ok && Array.isArray(j.comments)) list = j.comments;
        // sort oldest -> newest
        list.sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setComments(list);
        // populate likes map and liked state if provided
        const lm: Record<string, number> = {};
        const likedState: Record<string, boolean> = {};
        list.forEach((c: any) => {
          const id = c._id ?? c.id;
          if (id) {
            lm[id] = c.likesCount ?? 0;
            if (c.likedByCurrentUser !== undefined)
              likedState[id] = Boolean(c.likedByCurrentUser);
          }
        });
        setLikesMap(lm);
        setLiked(likedState);
      } catch (e) {}
    }
    fetchComments();
  }, []);

  const editorModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const editorFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "list",
      "link",
    ],
    []
  );

  function isHtmlEmpty(html: string) {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "");
    return stripped.trim().length === 0;
  }

  useEffect(() => {
    const socket = getSocket(token || undefined);
    function onNew(comment: any) {
      setComments((prev) => [...prev, comment]);
      const authorName =
        typeof comment.author === "string"
          ? comment.author
          : comment.author?.username || "Someone";
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
    function onLike(payload: any) {
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
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
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
    } catch (e) {}
  }

  async function toggleLike(commentId: string) {
    if (!token) {
      setToast("Please log in to like");
      setTimeout(() => setToast(""), 1500);
      return;
    }
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
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
        if (typeof j.liked === "boolean") {
          setLiked((s) => ({ ...s, [commentId]: j.liked }));
        } else {
          setLiked((s) => ({ ...s, [commentId]: !s[commentId] }));
        }
      }
    } catch (e) {
      /* ignore */
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
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
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
    } catch (e) {}
  }

  // ...existing code...

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] flex items-start justify-center">
      <div className="w-full max-w-4xl px-4">
        <Header />
        <div className="bg-white rounded-xl shadow p-4">
          <NotificationsPanel />
          <h1 className="text-2xl font-bold">Comments</h1>
          <div className="grid gap-3 mt-3">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="border border-gray-200 rounded-md p-2"
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
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>

        {/* Separate card for comment list with same visual style - this card will scroll */}
        <div
          className="bg-white rounded-xl shadow p-4 mt-4 comments-card mb-6"
          ref={listRef}
        >
          <h2 className="text-lg font-semibold">All comments</h2>
          <div className="comments-list">
            {/* group replies under their parent */}
            {(() => {
              const byParent: Record<string, any[]> = {};
              const top: any[] = [];
              comments.forEach((c) => {
                const id = (c as any)._id ?? (c as any).id;
                const parent = (c as any).parent ?? null;
                if (parent) {
                  byParent[parent] = byParent[parent] || [];
                  byParent[parent].push(c);
                } else {
                  top.push(c);
                }
              });

              return top.map((c) => {
                const id = (c as any)._id ?? (c as any).id;
                const created = new Date((c as any).createdAt).toLocaleString();
                const authorObj = (c as any).author;
                let authorName =
                  typeof authorObj === "string"
                    ? authorObj
                    : authorObj?.username || "Unknown";
                authorName = (authorName || "").toString().trim() || "Unknown";
                const authorId =
                  typeof authorObj === "string"
                    ? undefined
                    : authorObj?._id || authorObj?.id;
                // Show rounded avatar with first letter (safe)
                const avatarLetter = (authorName[0] || "?")
                  .toString()
                  .toUpperCase();
                return (
                  <div key={id} className="mb-3">
                    <div className="bg-white p-3 rounded-md shadow-sm comment-card">
                      <div className="text-xs muted">{created}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold uppercase">
                          {avatarLetter}
                        </div>
                        {authorId ? (
                          <Link href={`/users/${authorId}`}>{authorName}</Link>
                        ) : (
                          authorName
                        )}
                      </div>
                      <div className="mt-2">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              ((c as any).content ?? (c as any).text) || ""
                            ),
                          }}
                        />
                      </div>

                      <div className="mt-2 flex gap-2 items-center">
                        <button
                          onClick={() => id && toggleLike(id)}
                          className="px-2 py-1 rounded bg-gray-100"
                        >
                          👍 {likesMap[id] ?? 0}
                        </button>
                        <button
                          onClick={() => setReplyingTo(id)}
                          className="px-2 py-1 rounded bg-gray-100"
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
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => submitReply(id)}
                              className="px-3 py-1 rounded bg-blue-600 text-white"
                            >
                              Send reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1 rounded bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* render replies for this comment */}
                    <div className="ml-4 mt-2">
                      {(byParent[id] || []).map((r) => {
                        const rid = (r as any)._id ?? (r as any).id;
                        const rCreated = new Date(
                          (r as any).createdAt
                        ).toLocaleString();
                        const rAuthorObj = (r as any).author;
                        const rAuthor =
                          typeof rAuthorObj === "string"
                            ? rAuthorObj
                            : rAuthorObj?.username || "Unknown";
                        const rAuthorId =
                          typeof rAuthorObj === "string"
                            ? undefined
                            : rAuthorObj?._id || rAuthorObj?.id;
                        const rAuthorName =
                          (rAuthor || "").toString().trim() || "Unknown";
                        const rAvatarLetter = (rAuthorName[0] || "?")
                          .toString()
                          .toUpperCase();
                        return (
                          <div
                            key={rid}
                            className="comment-card"
                            style={{ marginTop: 8 }}
                          >
                            <div className="text-xs muted">{rCreated}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase text-sm">
                                {rAvatarLetter}
                              </div>

                              {rAuthorId ? (
                                <Link href={`/users/${rAuthorId}`}>
                                  {rAuthor}
                                </Link>
                              ) : (
                                rAuthor
                              )}
                            </div>
                            <div style={{ marginTop: 6 }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(
                                    ((r as any).content ?? (r as any).text) ||
                                      ""
                                  ),
                                }}
                              />
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <button
                                onClick={() => rid && toggleLike(rid)}
                                className="btn secondary"
                                style={{ padding: "6px 8px" }}
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
          <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
