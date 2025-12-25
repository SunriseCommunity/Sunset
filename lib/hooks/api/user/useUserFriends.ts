"use client";

import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import type {
  GetUserByIdFriendsCountResponse,
  GetUserByIdFriendStatusResponse,
  PostUserByIdFriendStatusData,
} from "@/lib/types/api";

export function useUserFriendsCount(userId: number) {
  return useSWR<GetUserByIdFriendsCountResponse>(
    `user/${userId}/friends/count`,
  );
}

export function useUserFriendshipStatus(userId: number) {
  const { data } = useUserSelf();

  return useSWR<GetUserByIdFriendStatusResponse>(
    data && data.user_id !== userId ? `user/${userId}/friend/status` : null,
  );
}

export function useUpdateUserFriendshipStatus(userId: number) {
  return useSWRMutation(
    `user/${userId}/friend/status`,
    async (
      url: string,
      { arg }: { arg: PostUserByIdFriendStatusData["body"] },
    ) => {
      await updateUserFriendshipStatus(`user/${userId}/friend/status`, { arg });
      mutate(`user/${userId}/friends/count`);
    },
  );
}

async function updateUserFriendshipStatus(url: string, { arg }: { arg: PostUserByIdFriendStatusData["body"] }) {
  await poster(url, {
    json: {
      ...arg,
    },
  });
}
