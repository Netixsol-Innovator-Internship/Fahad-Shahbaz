"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ActivityFeed({
  activities,
  formatActivity,
  formatDate,
}) {
  if (!activities.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.slice(0, 8).map((activity, index) => (
          <div
            key={`${activity.id}-${index}`}
            className="flex items-start gap-3 border-b border-border last:border-b-0 pb-4 last:pb-0"
          >
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm">{formatActivity(activity)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(activity.created_at)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
