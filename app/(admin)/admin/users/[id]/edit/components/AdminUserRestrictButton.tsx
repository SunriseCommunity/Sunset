import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminEditRestriction } from "@/lib/hooks/api/user/useAdminUserEdit";
import { UserSensitiveResponse } from "@/lib/types/api";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

const RESTRICTION_REASONS = [
  "Cheating/Hacking",
  "Multi-accounting",
  "Inappropriate behavior",
  "Spam",
  "Account sharing",
];

export default function AdminUserRestrictButton({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const { isMutating: isChangingRestriction } = useAdminEditRestriction(
    user.user_id
  );

  return (
    <>
      {user.restricted ? (
        <DialogConfirmActionReason user={user} actionType="unrestrict">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={isChangingRestriction}
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Unrestrict User
          </Button>
        </DialogConfirmActionReason>
      ) : (
        <DialogSelectRestrictionReason user={user} type="restrict">
          <Button
            variant="destructive"
            className="w-full"
            disabled={isChangingRestriction}
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Restrict User
          </Button>
        </DialogSelectRestrictionReason>
      )}
    </>
  );
}

function DialogSelectRestrictionReason({
  children,
  user,
  type,
}: {
  children: ReactNode;
  user: UserSensitiveResponse;
  type: "restrict" | "unrestrict";
}) {
  const [showRestrictionDialog, setShowRestrictionDialog] = useState(false);
  const [restrictionReasonType, setRestrictionReasonType] = useState("");
  const [restrictionReasonCustom, setRestrictionReasonCustom] = useState("");

  return (
    <Dialog
      open={showRestrictionDialog}
      onOpenChange={setShowRestrictionDialog}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            Restrict User
          </DialogTitle>
          <DialogDescription>
            Select a reason for restricting{" "}
            <span className="font-semibold text-foreground">
              {user.username}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Restriction Reason:</Label>
            <Select
              value={restrictionReasonType}
              onValueChange={setRestrictionReasonType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {[...RESTRICTION_REASONS, "Other"].map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {restrictionReasonType === "Other" && (
            <div className="space-y-2">
              <Label>Custom Reason:</Label>
              <textarea
                className="bg-card p-2 rounded-lg h-32 text-sm text-current max-h-96 w-full"
                value={restrictionReasonCustom}
                maxLength={256}
                onChange={(e: any) =>
                  setRestrictionReasonCustom(e.target.value)
                }
                placeholder="Enter the specific reason..."
                rows={4}
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <DialogConfirmActionReason
              user={user}
              actionType={type}
              restrictionReason={
                restrictionReasonType === "Other"
                  ? restrictionReasonCustom
                  : restrictionReasonType
              }
            >
              <Button
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
                disabled={
                  restrictionReasonType === "" ||
                  (restrictionReasonType === "Other" &&
                    restrictionReasonCustom.trim() === "")
                }
              >
                Proceed
              </Button>
            </DialogConfirmActionReason>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DialogConfirmActionReason({
  children,
  user,
  actionType,
  restrictionReason,
}: {
  children: ReactNode;
  user: UserSensitiveResponse;
  actionType: "restrict" | "unrestrict";
  restrictionReason?: string;
}) {
  const [showRestrictionConfirm, setShowRestrictionConfirm] = useState(false);

  const { toast } = useToast();

  const { trigger: editRestriction, isMutating: isChangingRestriction } =
    useAdminEditRestriction(user.user_id);

  const handleConfirmRestriction = async () => {
    try {
      const isRestrict = actionType === "restrict";

      await editRestriction({
        is_restrict: isRestrict,
        restriction_reason: isRestrict ? restrictionReason : null,
      });

      setShowRestrictionConfirm(false);

      toast({
        title: isRestrict
          ? "User restricted successfully!"
          : "User unrestricted successfully!",
        description: isRestrict
          ? "The user has been restricted from the platform."
          : "The user can now access the platform normally.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: `Failed to ${actionType} user`,
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog
      open={showRestrictionConfirm}
      onOpenChange={setShowRestrictionConfirm}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShieldAlert
              className={`w-5 h-5  ${
                actionType === "restrict"
                  ? "text-destructive"
                  : "text-green-500"
              }`}
            />
            Confirm{" "}
            {actionType === "restrict" ? "Restriction" : "Unrestriction"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {actionType === "restrict" ? (
              <>
                Are you sure you want to restrict{" "}
                <span className="font-semibold text-foreground">
                  {user.username}
                </span>
                ? This will prevent them from accessing most platform features.
              </>
            ) : (
              <>
                Are you sure you want to unrestrict{" "}
                <span className="font-semibold text-foreground">
                  {user.username}
                </span>
                ? This will restore their full access to the platform.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Card>
          <CardContent className="px-4 pt-2 whitespace-pre-wrap flex items-center gap-3 p-3 rounded-lg">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={user.avatar_url}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {user.user_id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {actionType === "restrict" && (
          <Card>
            <CardHeader className="p-4 pb-2">Restriction Reason</CardHeader>
            <CardContent className="px-4 pt-2 text-muted-foreground whitespace-pre-wrap">
              {restrictionReason}
            </CardContent>
          </Card>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isChangingRestriction}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmRestriction}
            disabled={isChangingRestriction}
          >
            Confirm{" "}
            {actionType === "restrict" ? "Restriction" : "Unrestriction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
