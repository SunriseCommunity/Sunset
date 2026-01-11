"use client";

import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { useAdminEditPrivilege } from "@/lib/hooks/api/user/useAdminUserEdit";
import type { UserSensitiveResponse } from "@/lib/types/api";
import { UserPrivilege } from "@/lib/types/api";

export const PRIVILEGE_OPTIONS = Object.values(UserPrivilege)
  .filter(value => value !== UserPrivilege.USER)
  .map(value => ({
    label: value.replaceAll(/([a-z])([A-Z])/g, "$1 $2"),
    value,
  }));

export default function AdminUserPrivilegeInput({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [selectedPrivileges, setSelectedPrivileges] = useState<UserPrivilege[]>(
    user.privilege,
  );
  const [error, setError] = useState<string | null>(null);

  const { trigger: editPrivilege, isMutating: isUpdatingPrivilege }
    = useAdminEditPrivilege(user.user_id);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedPrivileges(user.privilege);
  }, [user.privilege]);

  const handleSave = async () => {
    setError(null);

    const privileges = selectedPrivileges as UserPrivilege[];

    try {
      await editPrivilege({ privilege: privileges });

      toast({
        title: "Privileges updated successfully!",
        description: `Updated privileges for ${user.username}.`,
        variant: "success",
      });
    }
    catch (err: any) {
      const errorMessage = err.message ?? "Unknown error.";
      setError(errorMessage);
      toast({
        title: "Failed to update privileges",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const currentPrivileges = user.privilege;

  const hasChanges
    = selectedPrivileges.length !== currentPrivileges.length
      || !selectedPrivileges.every(p => currentPrivileges.includes(p));

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Shield className="size-4" />
        Privileges
      </Label>
      <div className="flex items-start gap-2">
        <MultiSelect
          options={PRIVILEGE_OPTIONS}
          onValueChange={(values: string[]) =>
            setSelectedPrivileges(values as UserPrivilege[])}
          defaultValue={Object.values(user.privilege).filter(
            v => v !== UserPrivilege.USER,
          )}
          placeholder="Select privileges..."
          className="flex-1"
        />
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isUpdatingPrivilege}
          variant="accent"
        >
          Save
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {selectedPrivileges.some(p => p !== UserPrivilege.USER) && (
        <p className="text-xs text-muted-foreground">
          Selected
          {" "}
          {selectedPrivileges.length}
          {" "}
          {selectedPrivileges.length === 1 ? "privilege" : "privileges"}
        </p>
      )}
    </div>
  );
}
