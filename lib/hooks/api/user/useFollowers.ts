"use client";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import { GetUserFollowersResponse } from "@/lib/types/api";
import useSWRInfinite from "swr/infinite";

export function useFollowers(limit?: number) {
  const { data } = useUserSelf();

  const getKey = (
    pageIndex: number,
    previousPageData?: GetUserFollowersResponse
  ) => {
    if (!data || (previousPageData && previousPageData.followers.length === 0))
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/followers?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetUserFollowersResponse>(getKey);
}
