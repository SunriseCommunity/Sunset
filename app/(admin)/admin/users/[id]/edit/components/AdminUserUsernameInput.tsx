import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAdminUsernameChange } from "@/lib/hooks/api/user/useAdminUserEdit";
import { UserSensitiveResponse } from "@/lib/types/api";
import { Edit } from "lucide-react";
import { useState } from "react";

export default function AdminUserUsernameInput({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [username, setUsername] = useState(user.username);

  const { isMutating: isChangingUsername } = useAdminUsernameChange(
    user.user_id
  );

  const canEdit =
    username.trim().length > 0 &&
    username !== user.username &&
    !isChangingUsername;

  return (
    <div className="flex items-center gap-2">
      <Input
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        className="flex-1"
        disabled={isChangingUsername}
      />
      <AlertDialogConfirmation user={user} username={username}>
        <Button
          variant={canEdit ? "default" : "outline"}
          size="icon"
          disabled={!canEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </AlertDialogConfirmation>
    </div>
  );
}

function AlertDialogConfirmation({
  children,
  user,
  username,
}: {
  children: React.ReactNode;
  user: UserSensitiveResponse;
  username: string;
}) {
  const { trigger: changeUsername, isMutating: isChangingUsername } =
    useAdminUsernameChange(user.user_id);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { toast } = useToast();

  const handleConfirmUsernameChange = async () => {
    try {
      await changeUsername({ new_username: username });
      toast({
        title: "Username changed successfully!",
        variant: "success",
      });
      setShowConfirmDialog(false);
    } catch (error: any) {
      toast({
        title: "Failed to change username",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Username Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the username for{" "}
            <span className="font-semibold text-foreground">
              {user.username}
            </span>{" "}
            to <span className="font-semibold text-foreground">{username}</span>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current username:</span>
            <span className="font-medium">{user.username}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">New username:</span>
            <span className="font-medium text-primary">{username}</span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isChangingUsername}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmUsernameChange}
            disabled={isChangingUsername}
          >
            {isChangingUsername ? "Changing..." : "Confirm Change"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
