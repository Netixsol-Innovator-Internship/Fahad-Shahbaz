"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { BACKEND_URL } from "../../../../lib/config";
import Link from "next/link";

export default function FollowersPage({ params }: { params: { id: string } }) {
  const [followers, setFollowers] = useState<
    { _id?: string; id?: string; username?: string }[]
  >([]);
  const { token } = useAuth();
  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        const base = BACKEND_URL;
        const res = await fetch(`${base}/users/${id}/followers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const j = await res.json();
        if (j?.followers) setFollowers(j.followers);
      } catch {
        // Error handling
      }
    }
    fetchData();
  }, [id, token]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2>Followers</h2>
      <ul>
        {followers.map((user) => (
          <li key={user._id ?? user.id}>
            <Link href={`/users/${user._id ?? user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
