"use client";

import { UpdateUserFriendshipAction } from "@/lib/hooks/api/user/types";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function useUserFriendshipStatus(userId: number) {
  const { data } = useUserSelf();

  return useSWR<{
    is_following_you: boolean;
    is_followed_by_you: boolean;
  }>(data && data.user_id != userId ? `user/${userId}/friend/status` : null);
}

export function useUpdateUserFriendshipStatus(userId: number) {
  return useSWRMutation(
    `user/${userId}/friend/status`,
    updateUserFriendshipStatus
  );
}

const updateUserFriendshipStatus = async (
  url: string,
  { arg }: { arg: { action: UpdateUserFriendshipAction } }
) => {
  await poster(url, {
    searchParams: {
      action: arg.action,
    },
  });
};
