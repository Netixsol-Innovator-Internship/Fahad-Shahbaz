"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function KeyStatistics({ userDetails }) {
  if (!userDetails) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold">{userDetails.public_repos}</div>
          <p className="text-muted-foreground">Public Repositories</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold">{userDetails.followers}</div>
          <p className="text-muted-foreground">Followers</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold">{userDetails.following}</div>
          <p className="text-muted-foreground">Following</p>
        </CardContent>
      </Card>
    </div>
  );
}
