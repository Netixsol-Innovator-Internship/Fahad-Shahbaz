"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchSection({ handleSearch, loading }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Discover GitHub Users</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Search for GitHub users by username, name, or keywords. Click on any
        user to view their comprehensive dashboard.
      </p>
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search GitHub users..."
            className="pl-10 pr-4 py-3 text-base"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 px-4 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
    </div>
  );
}
