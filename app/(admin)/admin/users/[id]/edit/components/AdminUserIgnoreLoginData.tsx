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

  // TODO: This is actually an oversight from the backend, since getting the initial value from the register event is really hacky.
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
          ? "Multi-account check exemption enabled"
          : "Multi-account check exemption disabled",
        variant: "success",
      });
    }
    catch (error: any) {
      setIsIgnored(serverIsIgnored);
      toast({
        title: "Failed to update multi-account exemption",
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
        <span>No Register event found — cannot manage multi-account exemption.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <Label
          htmlFor="ignore-login-data"
          className="flex cursor-pointer items-center gap-2"
        >
          <Database className="size-4" />
          Exempt from Multi-Account Check
        </Label>
        <p className="text-xs text-muted-foreground">
          Ignore user's IP used for registration when checking for multi-account
        </p>
      </div>
      <Switch
        id="ignore-login-data"
        checked={isIgnored}
        onCheckedChange={handleToggle}
        disabled={isMutating}
      />
    </div>
  );
}
