"use client";

import { User } from "@/lib/hooks/api/user/types";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import useSWRInfinite from "swr/infinite";

export function useFriends(limit?: number) {
  const { data } = useUserSelf();

  const getKey = (
    pageIndex: number,
    previousPageData?: { friends: User[] }
  ) => {
    if (!data || (previousPageData && previousPageData.friends.length === 0))
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/friends?${queryParams.toString()}`;
  };

  return useSWRInfinite<{ friends: User[]; total_count: number }>(getKey);
}
