"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../lib/config";
import { useRouter } from "next/navigation";
import { getSocket } from "../lib/socket";

type Props = {
  targetId: string;
  onChange?: () => void;
  initialFollowing?: boolean;
};

export default function FollowButton({
  targetId,
  onChange,
  initialFollowing,
}: Props) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState<boolean>(!!initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if initialFollowing was provided don't fetch
    if (initialFollowing !== undefined) return;
    if (!token || !user) return;

    let mounted = true;
    const base = BACKEND_URL;

    (async () => {
      try {
        const res = await fetch(
          `${base}/users/${targetId}/followers?limit=1000`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const j = await res.json();
        if (!mounted) return;
        if (j?.ok && Array.isArray(j.followers)) {
          const found = j.followers.find(
            (f: any) => String(f.id) === String(user.id)
          );
          setFollowing(!!found);
        }
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [targetId, token, user, initialFollowing]);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token || undefined);
    function onFollow(payload: any) {
      if (!payload || String(payload.target) !== String(targetId)) return;
      if (payload.type === "follow") setFollowing(true);
      else if (payload.type === "unfollow") setFollowing(false);
    }
    socket.on("user:follow", onFollow);
    return () => {
      socket.off("user:follow", onFollow);
    };
  }, [token, targetId]);

  async function toggle() {
    if (!token || !user) {
      // require login
      router.push(`/login`);
      return;
    }
    // optimistic UI: flip immediately, rollback on failure
    const prev = following;
    setFollowing(!prev);
    setLoading(true);
    const base = BACKEND_URL;
    const action = prev ? "unfollow" : "follow";
    try {
      const res = await fetch(`${base}/users/${targetId}/${action}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const j = await res.json();
      if (!j?.ok) {
        // rollback on failure
        setFollowing(prev);
      } else {
        if (onChange) onChange();
      }
    } catch (err) {
      // rollback on network/error
      setFollowing(prev);
      console.error("Follow toggle failed", err);
    } finally {
      setLoading(false);
    }
  }

  if (String(user?.id) === String(targetId)) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-2 rounded-lg border ${
        following
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-transparent text-gray-900 border-gray-300"
      } ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
