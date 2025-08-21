"use client";

import { Button } from "@/components/ui/button";
import { Github, ArrowLeft } from "lucide-react";

export default function Header({ selectedUser, goBackToSearch }) {
  return (
    <header className="border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goBackToSearch}
              className="mr-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Github className="h-6 w-6" />
          <h1 className="text-base md:text-xl font-semibold">
            {selectedUser
              ? `${selectedUser}'s Dashboard`
              : "GitHub User Search"}
          </h1>
        </div>
        {/* Theme toggle removed */}
      </div>
    </header>
  );
}
