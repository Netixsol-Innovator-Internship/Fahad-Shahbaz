"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";
import { BACKEND_URL } from "../../../../lib/config";

export default function FollowingPage({ params }: { params: { id: string } }) {
  const { token } = useAuth();
  const { id } = params;
  const [list, setList] = useState<
    { _id?: string; id?: string; username?: string }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    const base = BACKEND_URL;
    (async () => {
      try {
        const res = await fetch(`${base}/users/${id}/following`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const j = await res.json();
        if (!mounted) return;
        if (j?.ok) setList(j.following || []);
      } catch {
        // Error handling
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, token]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2>Following</h2>
      <ul>
        {list.map((u) => (
          <li key={u.id}>
            <Link href={`/users/${u.id}`}>{u.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
