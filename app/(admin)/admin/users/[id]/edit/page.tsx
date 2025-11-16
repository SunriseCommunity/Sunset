"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrettyHeader from "@/components/General/PrettyHeader";
import { User, Activity, FileText } from "lucide-react";
import { useAdminUserSensitive } from "@/lib/hooks/api/user/useAdminUserEdit";
import Spinner from "@/components/Spinner";
import { Card, CardContent } from "@/components/ui/card";
import AdminUserEditGeneral from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditGeneral";
import { WorkInProgress } from "@/components/WorkInProgress";
import AdminUserEditEvent from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditEvents";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = parseInt(id);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") ?? "general";
  const [activeTab, setActiveTab] = useState(tab);
  const [hasAcceptedEventsWarning, setHasAcceptedEventsWarning] =
    useState(false);
  const [showEventsWarning, setShowEventsWarning] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const hasCheckedInitialTab = useRef(false);

  const { data: user, isLoading } = useAdminUserSensitive(userId);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      pathname + "?" + createQueryString("tab", activeTab)
    );
  }, [activeTab, pathname, createQueryString]);

  useEffect(() => {
    if (
      !hasCheckedInitialTab.current &&
      tab === "events" &&
      !hasAcceptedEventsWarning &&
      !isLoading &&
      user
    ) {
      hasCheckedInitialTab.current = true;
      setActiveTab("general");
      setPendingTab("events");
      setShowEventsWarning(true);
    }
  }, [tab, hasAcceptedEventsWarning, isLoading, user]);

  const handleTabChange = (value: string) => {
    if (value === "events" && !hasAcceptedEventsWarning) {
      setPendingTab(value);
      setShowEventsWarning(true);
    } else {
      setActiveTab(value);
    }
  };

  const handleProceedToEvents = () => {
    setHasAcceptedEventsWarning(true);
    setShowEventsWarning(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleGoBack = () => {
    setShowEventsWarning(false);
    setPendingTab(null);
  };

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
        text={`Edit User: ${user.username} (ID: ${user.user_id})`}
        roundBottom
        icon={<User />}
      />

      <AlertDialog
        open={showEventsWarning}
        onOpenChange={(open) => {
          if (!open) {
            handleGoBack();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sensitive Information Warning</AlertDialogTitle>
            <AlertDialogDescription>
              The information displayed in the Events tab can be very sensitive.
              Please proceed with caution!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleGoBack}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleProceedToEvents}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
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
              <WorkInProgress />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <AdminUserEditEvent user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
