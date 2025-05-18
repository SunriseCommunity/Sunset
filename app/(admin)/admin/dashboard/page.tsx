"use client";

import { ServerStatusCards } from "@/app/(admin)/admin/dashboard/components/serverStatusCards";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { UserListItem } from "@/components/UserListElement";
import { WorkInProgress } from "@/components/WorkInProgress";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";

export default function Page() {
  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  return (
    <div className="space-y-4">
      <ServerStatusCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>New users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {serverStatus?.recent_users &&
              serverStatus.recent_users.map((user, i) => (
                <UserListItem
                  user={user}
                  key={i}
                  includeFriendshipButton={false}
                />
              ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent scores</CardTitle>
            <CardDescription>Latests submitted users scores</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkInProgress />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
