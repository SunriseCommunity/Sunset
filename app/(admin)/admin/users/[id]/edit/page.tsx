"use client";

import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrettyHeader from "@/components/General/PrettyHeader";
import { User, Activity, FileText } from "lucide-react";
import { useAdminUserSensitive } from "@/lib/hooks/api/user/useAdminUserEdit";
import Spinner from "@/components/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import AdminUserEditGeneral from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditGeneral";
import { WorkInProgress } from "@/components/WorkInProgress";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = parseInt(id);

  const { data: user, isLoading } = useAdminUserSensitive(userId);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        text={`Edit User: ${user.username}`}
        roundBottom
        icon={<User />}
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-card grid w-full grid-cols-3 ">
          <TabsTrigger value="general">
            <User className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="events">
            <FileText className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <AdminUserEditGeneral user={user} />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card className="p-8">
            <CardContent className="text-center text-muted-foreground">
              <WorkInProgress  />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card className="p-8">
            <CardContent className="text-center text-muted-foreground">
              <WorkInProgress />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
