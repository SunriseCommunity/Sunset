"use client";

import { AlertCircle, Database } from "lucide-react";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminEditIgnoreLoginData,
  useUserEvents,
} from "@/lib/hooks/api/user/useAdminUserEdit";
import { UserEventType } from "@/lib/types/api";

function parseIsIgnored(jsonData: string): boolean {
  try {
    const parsed = JSON.parse(jsonData);
    return parsed?.IsExemptFromMultiaccountCheck ?? false;
  }
  catch {
    return false;
  }
}

export default function AdminUserIgnoreLoginData({
  userId,
}: {
  userId: number;
}) {
  const { toast } = useToast();

  const { data: registerEvents, isLoading } = useUserEvents(
    userId,
    null,
    1,
    1,
    [UserEventType.REGISTER],
  );

  const { trigger: editIgnoreLoginData, isMutating }
    = useAdminEditIgnoreLoginData(userId);

  const registerEvent = registerEvents?.events?.[0];
  const serverIsIgnored = registerEvent
    ? parseIsIgnored(registerEvent.json_data)
    : false;

  const [isIgnored, setIsIgnored] = useState(serverIsIgnored);

  useEffect(() => {
    setIsIgnored(serverIsIgnored);
  }, [serverIsIgnored]);

  const handleToggle = async (checked: boolean) => {
    setIsIgnored(checked);
    try {
      await editIgnoreLoginData({ is_ignored: checked });
      toast({
        title: checked
          ? "Login data is now ignored"
          : "Login data is no longer ignored",
        variant: "success",
      });
    }
    catch (error: any) {
      setIsIgnored(serverIsIgnored);
      toast({
        title: "Failed to update ignore login data",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return null;

  if (!registerEvent) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
        <AlertCircle className="size-4 shrink-0" />
        <span>No Register event found — cannot manage login data ignore setting.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor="ignore-login-data"
        className="flex cursor-pointer items-center gap-2"
      >
        <Database className="size-4" />
        Ignore Login Data
      </Label>
      <Switch
        id="ignore-login-data"
        checked={isIgnored}
        onCheckedChange={handleToggle}
        disabled={isMutating}
      />
    </div>
  );
}
