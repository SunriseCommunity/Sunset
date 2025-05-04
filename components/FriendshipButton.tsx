"use client";

import { Button } from "@/components/ui/button";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import {
  useUpdateUserFriendshipStatus,
  useUserFriendshipStatus,
} from "@/lib/hooks/api/user/useUserFriendshipStatus";
import useSelf from "@/lib/hooks/useSelf";
import { UpdateFriendshipStatusAction } from "@/lib/types/api";
import { UserMinus, UserPlus } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function FriendshipButton({
  userId,
  includeText = true,
  className,
}: {
  userId: number;
  includeText?: boolean;
  className?: string;
}) {
  const { self } = useSelf();

  const { trigger } = useUpdateUserFriendshipStatus(userId);

  const { data, isLoading } = useUserFriendshipStatus(userId);

  const userFriendshipStatus = data;

  const updateFriendshipStatus = async (
    action: UpdateFriendshipStatusAction
  ) => {
    trigger(
      { action },
      {
        optimisticData: data && {
          ...data,
          is_followed_by_you: action === UpdateFriendshipStatusAction.ADD,
        },
      }
    );
  };

  if (!self || userId === self.user_id) return;

  const { is_followed_by_you, is_following_you } = userFriendshipStatus ?? {};
  const isMutual = is_followed_by_you && is_following_you;

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!userFriendshipStatus) return;

        updateFriendshipStatus(
          is_followed_by_you
            ? UpdateFriendshipStatusAction.REMOVE
            : UpdateFriendshipStatusAction.ADD
        );
      }}
      className={twMerge(
        isMutual
          ? "bg-pink-700 text-white hover:bg-pink-500"
          : is_followed_by_you
          ? "bg-lime-700 text-white hover:bg-lime-500"
          : "",
        className
      )}
      isLoading={isLoading}
      variant={isLoading ? "secondary" : "default"}
    >
      {is_followed_by_you ? <UserMinus /> : <UserPlus />}
      {includeText && (
        <span className="hidden md:inline">
          {isMutual ? "Unfriend" : is_followed_by_you ? "Unfollow" : "Follow"}
        </span>
      )}
    </Button>
  );
}
