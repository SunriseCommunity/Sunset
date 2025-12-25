import { Activity, AlertCircle, BarChart3, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";

export function ServerStatusCards() {
  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {serverStatus ? (
            <div className="text-2xl font-bold">
              {serverStatus?.total_users.toLocaleString()}
            </div>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users Online</CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {serverStatus ? (
            <>
              <div className="text-2xl font-bold">
                {serverStatus.users_online.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  (serverStatus.users_online / serverStatus.total_users)
                  * 100
                ).toFixed(2)}
                % of total users
              </p>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Restrictions</CardTitle>
          <AlertCircle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {serverStatus ? (
            <>
              <div className="text-2xl font-bold">
                {serverStatus.total_restrictions?.toLocaleString() || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {(
                  ((serverStatus.total_restrictions || 0)
                    / serverStatus.total_users)
                  * 100
                ).toFixed(2)}
                % of users
              </p>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Scores</CardTitle>
          <BarChart3 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {serverStatus ? (
            <div className="text-2xl font-bold">
              {serverStatus.total_scores?.toLocaleString() || "N/A"}
            </div>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
