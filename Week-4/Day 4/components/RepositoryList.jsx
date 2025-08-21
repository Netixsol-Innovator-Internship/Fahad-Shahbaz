"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork } from "lucide-react";

export default function RepositoryList({ repositories }) {
  if (!repositories.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Repositories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="border-b border-border last:border-b-0 pb-4 last:pb-0"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3
                  className="font-semibold text-primary hover:underline cursor-pointer"
                  onClick={() => window.open(repo.html_url, "_blank")}
                >
                  {repo.name}
                </h3>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {repo.language && (
                    <Badge variant="secondary">{repo.language}</Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
