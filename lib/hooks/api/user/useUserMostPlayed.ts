"use client";

import { GameMode, GetUserByIdMostplayedResponse } from "@/lib/types/api";
import useSWRInfinite from "swr/infinite";

export function useUserMostPlayed(
  userId: number,
  mode: GameMode,
  limit?: number
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: GetUserByIdMostplayedResponse
  ) => {
    if (previousPageData && previousPageData.most_played.length === 0)
      return null;

    const queryParams = new URLSearchParams({
      mode: mode.toString(),
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/${userId}/mostplayed?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetUserByIdMostplayedResponse>(getKey);
}
