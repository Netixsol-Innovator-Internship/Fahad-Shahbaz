"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const profileNavItems = [
  { href: "/profile", label: "Personal Information", key: "personal" },
  { href: "/profile/my-cars", label: "My Cars", key: "cars" },
  { href: "/profile/my-bids", label: "My Bids", key: "bids" },
  { href: "/profile/wishlist", label: "Wishlist", key: "wishlist" },
];

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <PageHeader
        title="My Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Profile", href: "/profile" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="rounded-lg shadow-sm border p-6">
              <nav className="space-y-2">
                {profileNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
