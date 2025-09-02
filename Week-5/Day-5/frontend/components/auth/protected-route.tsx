"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../lib/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Ensure SSR and initial client render match to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, requireAuth, router]);

  // During SSR / before mount, render nothing so server/client markup match
  if (!mounted) return null;

  if (requireAuth && !isAuthenticated) {
    // Optionally render a lightweight placeholder after mount
    return <div className="min-h-screen" aria-hidden />;
  }

  return <>{children}</>;
}
