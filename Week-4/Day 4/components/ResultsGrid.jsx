"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ResultsGrid({ users = [], fetchUserDetails }) {
  if (!users.length) return null;
  return (
  <div className="grid gap-x-4 gap-y-4" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {users.map((user) => (
        <Card
          key={user.id}
          className="group hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
          style={{ width: '100%', maxWidth: '290px', height: '300px', margin: '0 auto' }}
          onClick={() => fetchUserDetails(user.login)}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.avatar_url || "/placeholder.svg"}
                  alt={user.login}
                />
                <AvatarFallback>
                  {user.login.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{user.login}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.type === "User" ? "Developer" : "Organization"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
