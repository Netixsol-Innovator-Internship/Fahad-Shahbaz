"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";

export default function FollowersPage({ params }: { params: { id: string } }) {
  const { token } = useAuth();
  const { id } = params;
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    (async () => {
      try {
        const res = await fetch(`${base}/users/${id}/followers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const j = await res.json();
        if (!mounted) return;
        if (j?.ok) setList(j.followers || []);
      } catch (e) {}
    })();
    return () => {
      mounted = false;
    };
  }, [id, token]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2>Followers</h2>
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
