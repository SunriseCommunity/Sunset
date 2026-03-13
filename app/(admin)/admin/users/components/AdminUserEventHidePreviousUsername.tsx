"use client";

import { EyeOff } from "lucide-react";
import { useState } from "react";

import { Tooltip } from "@/components/Tooltip";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAdminEditHidePreviousUsername } from "@/lib/hooks/api/user/useAdminUserEdit";
import type { EventUserResponse } from "@/lib/types/api";
import { UserEventType } from "@/lib/types/api";

function parseIsHidden(jsonData: string): boolean {
  try {
    const parsed = JSON.parse(jsonData);
    return parsed?.IsHiddenFromPreviousUsernames ?? false;
  }
  catch {
    return false;
  }
}

export default function AdminUserEventHidePreviousUsername({
  event,
}: {
  event: EventUserResponse;
}) {
  const { toast } = useToast();
  const { trigger: editHidePreviousUsername, isMutating }
    = useAdminEditHidePreviousUsername(event.user.user_id);

  const serverIsHidden = parseIsHidden(event.json_data);
  const [isHidden, setIsHidden] = useState(serverIsHidden);

  if (event.event_type !== UserEventType.CHANGE_USERNAME) {
    return null;
  }

  const handleToggle = async (checked: boolean) => {
    setIsHidden(checked);
    try {
      await editHidePreviousUsername({
        event_id: event.id,
        is_hidden: checked,
      });
      toast({
        title: checked
          ? "Previous username is now hidden"
          : "Previous username is now visible",
        variant: "success",
      });
    }
    catch (error: any) {
      setIsHidden(serverIsHidden);
      toast({
        title: "Failed to update previous username visibility",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Tooltip content={isHidden ? "Previous username is hidden" : "Hide previous username"}>
      <div className="flex items-center gap-2 px-2">
        <EyeOff className="size-4 text-muted-foreground" />
        <Switch
          checked={isHidden}
          onCheckedChange={handleToggle}
          disabled={isMutating}
        />
      </div>
    </Tooltip>
  );
}
