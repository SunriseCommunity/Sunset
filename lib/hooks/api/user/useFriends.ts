"use client";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import { GetUserFriendsResponse } from "@/lib/types/api";
import useSWRInfinite from "swr/infinite";

export function useFriends(limit?: number) {
  const { data } = useUserSelf();

  const getKey = (
    pageIndex: number,
    previousPageData?: GetUserFriendsResponse
  ) => {
    if (!data || (previousPageData && previousPageData.friends.length === 0))
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/friends?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetUserFriendsResponse>(getKey);
}
