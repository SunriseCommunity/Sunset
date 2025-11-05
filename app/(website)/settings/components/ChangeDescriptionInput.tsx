"use client";

import BBCodeInput from "@/components/BBCode/BBCodeInput";
import { useToast } from "@/hooks/use-toast";
import { useAdminEditDescription } from "@/lib/hooks/api/user/useAdminUserEdit";
import { useEditDescription } from "@/lib/hooks/api/user/useEditDescription";
import useSelf from "@/lib/hooks/useSelf";
import { UserResponse } from "@/lib/types/api";

export default function ChangeDescriptionInput({
  user,
}: {
  user: UserResponse;
}) {
  const self = useSelf();

  const { trigger: triggerSelf, isMutating: isUpdatingSelfDescription } =
    useEditDescription();
  const { trigger: triggerUser, isMutating: isUpdatingUserDescription } =
    useAdminEditDescription(user.user_id);

  const { toast } = useToast();

  const isSelf = user.user_id === self?.self?.user_id;

  const saveDescription = (text: string) => {
    const trigger = isSelf ? triggerSelf : triggerUser;

    trigger(
      { description: text },
      {
        onSuccess() {
          toast({
            title: "Description updated successfully!",
            variant: "success",
          });
        },
        onError(err) {
          toast({
            title: err?.message ?? "An unknown error occurred",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <BBCodeInput
      defaultText={user?.description ?? ""}
      onSave={saveDescription}
      isSaving={isUpdatingSelfDescription || isUpdatingUserDescription}
    />
  );
}
