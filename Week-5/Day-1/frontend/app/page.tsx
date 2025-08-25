"use client";

import { useState, useRef, useEffect } from "react";

type Comment = {
  id: string;
  text: string;
  author: string;
  clientId: string;
  createdAt: number;
};
import { getSocket } from "../lib/socket";

export default function Page() {
  useEffect(() => {
    // Fetch initial comments from backend
    async function fetchComments() {
      try {
        const res = await fetch(`https://realtimebackend.vercel.app/comments`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setComments(data);
        }
      } catch {
        // Optionally handle error
      }
    }
    fetchComments();
  }, []);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [toast, setToast] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const myId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("clientId") || window.crypto.randomUUID()
      : "client-123";
  if (typeof window !== "undefined")
    window.sessionStorage.setItem("clientId", myId);
  useEffect(() => {
    const socket = getSocket();
    socket.on("new_comment", (comment) => {
      setComments((prev) => {
        // Prevent duplicate comments
        if (prev.some((c) => c.id === comment.id)) return prev;
        return [comment, ...prev];
      });
      // Show notification only if comment is from another user
      if (comment.clientId !== myId) {
        setToast(`${comment.author} commented!`);
        setTimeout(() => setToast(""), 2000);
      }
    });
    return () => {
      socket.off("new_comment");
    };
  }, [myId]);

  async function submit() {
    const trimmed = text.trim();
    const name = author.trim() || "Anonymous";
    if (!trimmed) return;

    const res = await fetch(`https://realtimebackend.vercel.app/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, author: name, clientId: myId }),
    });

    const json = await res.json();
    if (json?.ok) {
      setText("");
      // Do not update comments here; rely on socket event for real-time update
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f9fc] flex items-start justify-center">
      <div className="max-w-2xl w-full p-4 sm:p-8 rounded-2xl shadow-2xl bg-white flex flex-col gap-6 sm:gap-8 border border-gray-200 mt-10 max-h-[80vh] overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700 tracking-tight">
          💬 Real-time Comments
        </h1>

        <div className="grid gap-3 sm:gap-4">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="border border-gray-300 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full sm:flex-1 border border-gray-300 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
            <button
              onClick={submit}
              className="w-full sm:w-auto px-4 py-3 sm:px-6 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 active:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 sm:mb-0 cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>

        <div ref={listRef} className="grid gap-3 sm:gap-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow hover:shadow-md transition"
            >
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="font-semibold text-blue-700 mb-1">
                  {c.author}
                </div>
                <div className="text-gray-800 break-all max-h-40 overflow-y-auto whitespace-pre-line text-sm sm:text-base">
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {toast && (
          <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 border border-blue-400 rounded-lg shadow-lg px-4 py-2 sm:px-6 sm:py-3 bg-white text-blue-700 font-semibold animate-fade-in">
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
