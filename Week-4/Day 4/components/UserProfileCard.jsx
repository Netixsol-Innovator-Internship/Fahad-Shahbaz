"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar } from "lucide-react";

export default function UserProfileCard({ userDetails, formatDate }) {
  if (!userDetails) return null;
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={userDetails.avatar_url || "/placeholder.svg"}
              alt={userDetails.login}
            />
            <AvatarFallback>
              {userDetails.login.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                {userDetails.name || userDetails.login}
              </h2>
              <p className="text-muted-foreground">@{userDetails.login}</p>
            </div>
            {userDetails.bio && (
              <p className="text-foreground">{userDetails.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {userDetails.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userDetails.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(userDetails.created_at)}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(userDetails.html_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
