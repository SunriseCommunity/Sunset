"use client";

import { useState, useEffect } from "react";
import { UserSensitiveResponse, UserPrivilege } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAdminEditPrivilege } from "@/lib/hooks/api/user/useAdminUserEdit";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const PRIVILEGE_OPTIONS = [
  {
    label: "Supporter",
    value: UserPrivilege.SUPPORTER,
  },
  {
    label: "BAT",
    value: UserPrivilege.BAT,
  },
  {
    label: "Admin",
    value: UserPrivilege.ADMIN,
  },
  {
    label: "Developer",
    value: UserPrivilege.DEVELOPER,
  },
  {
    label: "Server Bot",
    value: UserPrivilege.SERVER_BOT,
  },
];

export default function AdminUserPrivilegeInput({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([
    user.privilege,
  ]);
  const [error, setError] = useState<string | null>(null);

  const { trigger: editPrivilege, isMutating: isUpdatingPrivilege } =
    useAdminEditPrivilege(user.user_id);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedPrivileges(user.privilege as unknown as string[]); // TODO: Backend returns string[]
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
    } catch (err: any) {
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

  const hasChanges =
    selectedPrivileges.length !== currentPrivileges.length ||
    !selectedPrivileges.every((p) => currentPrivileges.includes(p));

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Privileges
      </Label>
      <div className="flex items-start gap-2">
        <MultiSelect
          options={PRIVILEGE_OPTIONS}
          onValueChange={setSelectedPrivileges}
          defaultValue={Object.values(user.privilege).filter(
            (v) => v != UserPrivilege.USER
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
      {selectedPrivileges.filter((p) => p !== UserPrivilege.USER).length >
        0 && (
        <p className="text-xs text-muted-foreground">
          Selected {selectedPrivileges.length}{" "}
          {selectedPrivileges.length === 1 ? "privilege" : "privileges"}
        </p>
      )}
    </div>
  );
}
