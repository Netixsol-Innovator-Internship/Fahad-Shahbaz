"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Heart, Bell, LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#2E3D83] text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span>Call Us: 570-694-4002</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Email Id: info@cardeposit.com</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Car Deposit Logo"
                className="h-10"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/auction"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Car Auction
              </Link>
              <Link
                href="/sell-your-car"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sell Your Car
              </Link>
              {/* <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                About us
              </Link> */}
              <Link
                href="#"
                className="text-gray-700 font-medium cursor-not-allowed"
              >
                Contact
              </Link>
              {/* <Link
                href="/profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                My Profile
              </Link> */}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              {/* Defer auth-dependent UI until after mount to avoid hydration mismatch */}
              {!mounted ? (
                <div className="h-9 w-[190px]" aria-hidden />
              ) : isAuthenticated ? (
                <div
                  className="flex items-center gap-2"
                  suppressHydrationWarning
                >
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2"
                  suppressHydrationWarning
                >
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <span className="text-gray-400">or</span>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-[#2E3D83] hover:bg-blue-800 cursor-pointer"
                    >
                      Register now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
