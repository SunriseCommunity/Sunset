"use client";

import PrettyButton from "@/components/General/PrettyButton";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import {
  useUpdateUserFriendshipStatus,
  useUserFriendshipStatus,
} from "@/lib/hooks/api/user/useUserFriendshipStatus";
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
  const self = useUserSelf();

  const { trigger } = useUpdateUserFriendshipStatus(userId);

  const userFriendshipStatusQuery = useUserFriendshipStatus(userId);

  const userFriendshipStatus = userFriendshipStatusQuery.data;

  const updateFriendshipStatus = async (action: "add" | "remove") => {
    trigger(
      { action },
      {
        optimisticData: userFriendshipStatusQuery.data && {
          ...userFriendshipStatusQuery.data,
          is_followed_by_you: action === "add",
        },
      }
    );
  };

  if (!self.data || !userFriendshipStatus) return;

  const { is_followed_by_you, is_following_you } = userFriendshipStatus;
  const isMutual = is_followed_by_you && is_following_you;

  return (
    <PrettyButton
      onClick={() => {
        updateFriendshipStatus(
          userFriendshipStatus.is_followed_by_you ? "remove" : "add"
        );
      }}
      icon={
        userFriendshipStatus.is_followed_by_you ? <UserMinus /> : <UserPlus />
      }
      className={twMerge(
        isMutual
          ? "bg-pink-700 text-white hover:bg-pink-500"
          : is_followed_by_you
          ? "bg-lime-700 text-white hover:bg-lime-500"
          : "",
        className
      )}
      text={
        includeText
          ? isMutual
            ? "Unfriend"
            : is_followed_by_you
            ? "Unfollow"
            : "Follow"
          : undefined
      }
    />
  );
}
