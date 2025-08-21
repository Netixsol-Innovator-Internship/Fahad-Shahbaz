"use client";

import { Github } from "lucide-react";

export default function EmptyState({ type }) {
  if (type === "noResults") {
    return (
      <div className="text-center py-12">
        <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No users found</h3>
        <p className="text-muted-foreground">
          Try searching with different keywords or usernames.
        </p>
      </div>
    );
  }
  return (
    <div className="text-center py-12">
      <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Start your search</h3>
      <p className="text-muted-foreground">
        Enter a username or keyword above to discover GitHub users.
      </p>
    </div>
  );
}
