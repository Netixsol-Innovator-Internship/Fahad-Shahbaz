"use client";

import React, { useEffect, useState, use } from "react";
import { useAuth } from "../../../context/AuthContext";
import { BACKEND_URL } from "../../../lib/config";
import FollowButton from "../../../components/FollowButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSocket } from "../../../lib/socket";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<"profile" | "followers" | "following">(
    "profile"
  );
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  // Next.js 15+ migration: params is always an object in client components
  const { id } = params;
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const router = useRouter();
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined);

  // Protect route: redirect to /login if not authenticated
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Fetch followers and following lists
  useEffect(() => {
    const base = BACKEND_URL;
    (async () => {
      try {
        const resF = await fetch(`${base}/users/${id}/followers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const jF = await resF.json();
        setFollowersList(jF?.followers || []);
        const resG = await fetch(`${base}/users/${id}/following`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const jG = await resG.json();
        setFollowingList(jG?.following || []);
      } catch (e) {}
    })();
  }, [id, token]);

  useEffect(() => {
    let mounted = true;
    const base = BACKEND_URL;

    (async () => {
      try {
        const res = await fetch(`${base}/users/${id}`);
        const j = await res.json();
        if (!mounted) return;
        if (j?.error) {
          setProfile(null);
        } else {
          setProfile(j);
          setFollowersCount(j.followersCount ?? 0);
          setFollowingCount(j.followingCount ?? 0);
          setIsFollowed(j.isFollowedByCurrentUser);
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function refreshCounts() {
    const base = BACKEND_URL;
    try {
      const res = await fetch(`${base}/users/${id}`);
      const j = await res.json();
      if (!j?.error) {
        setFollowersCount(j.followersCount ?? 0);
        setFollowingCount(j.followingCount ?? 0);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    const socket = getSocket(token || undefined);
    function onFollow(payload: any) {
      // payload: { type: 'follow'|'unfollow', actor, target }
      if (!payload || String(payload.target) !== String(id)) return;
      if (payload.type === "follow") {
        setFollowersCount((n) => (typeof n === "number" ? n + 1 : n));
        setIsFollowed(true);
      } else if (payload.type === "unfollow") {
        setFollowersCount((n) =>
          typeof n === "number" ? Math.max(0, n - 1) : n
        );
        setIsFollowed(false);
      }
    }
    socket.on("user:follow", onFollow);
    return () => {
      socket.off("user:follow", onFollow);
    };
  }, [id, token]);

  if (!token) return null;
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found</div>;

  return (
    <div
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6"
      style={{ padding: "clamp(16px, 5vw, 32px)" }}
    >
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer border ${
            tab === "profile"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-gray-100 text-gray-900"
          }`}
          onClick={() => setTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer border ${
            tab === "followers"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-gray-100 text-gray-900"
          }`}
          onClick={() => setTab("followers")}
        >
          Followers
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer border ${
            tab === "following"
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-gray-100 text-gray-900"
          }`}
          onClick={() => setTab("following")}
        >
          Following
        </button>
      </div>
      {/* Tab content */}
      {tab === "profile" && (
        <>
          <div className="flex items-center gap-6 flex-wrap">
            {/* Rounded avatar with first letter of name */}
            <div className="min-w-16 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-md mb-2">
              {profile.username ? profile.username[0] : "?"}
            </div>
            <div className="flex-1 min-w-[180px] flex flex-col gap-2">
              <div>
                <span className="font-semibold text-lg">Name:</span>{" "}
                {editingName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-lg font-medium px-2 py-1 rounded-md border border-gray-300 mr-2"
                      autoFocus
                    />
                    <button
                      className="bg-blue-600 text-white border-none rounded-md px-2 py-1 mr-1 cursor-pointer"
                      onClick={async () => {
                        // Save new name to backend
                        const base = BACKEND_URL;
                        const res = await fetch(`${base}/users/${id}/update`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ username: newName }),
                        });
                        if (res.ok) {
                          setProfile((p: any) => ({ ...p, username: newName }));
                          setEditingName(false);
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-200 text-gray-800 border-none rounded-md px-2 py-1 cursor-pointer"
                      onClick={() => setEditingName(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {profile.username}
                    <button
                      className="ml-2 bg-none border-none cursor-pointer align-middle p-0"
                      aria-label="Edit name"
                      title="Edit name"
                      onClick={() => {
                        setNewName(profile.username || "");
                        setEditingName(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {profile.email && (
                <div>
                  <span style={{ fontWeight: 600 }}>Email:</span>{" "}
                  {profile.email}
                </div>
              )}
              {profile.bio && (
                <div>
                  <span style={{ fontWeight: 600 }}>Bio:</span> {profile.bio}
                </div>
              )}
              {profile.createdAt && (
                <div>
                  <span style={{ fontWeight: 600 }}>Joined:</span>{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div>Followers: {followersCount ?? "-"}</div>
            <div>Following: {followingCount ?? "-"}</div>
            <FollowButton
              targetId={id}
              initialFollowing={
                isFollowed !== undefined
                  ? isFollowed
                  : profile.isFollowedByCurrentUser
              }
              onChange={() => {
                // refresh counts after follow/unfollow
                refreshCounts();
              }}
            />
          </div>
          <div style={{ marginTop: 18 }}>
            <a href="/" onClick={() => router.push("/comments")} className="underline">
              View comments
            </a>
          </div>
        </>
      )}
      {tab === "followers" && (
        <div>
          <h2>Followers</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {followersList.map((u) => (
              <li
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase text-sm">
                  {u.username ? u.username[0].toUpperCase() : "?"}
                </div>
                <Link href={`/users/${u.id}`}>{u.username}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === "following" && (
        <div>
          <h2>Following</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {followingList.map((u) => (
              <li
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase text-sm">
                  {u.username ? u.username[0].toUpperCase() : "?"}
                </div>
                <Link href={`/users/${u.id}`}>{u.username}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
