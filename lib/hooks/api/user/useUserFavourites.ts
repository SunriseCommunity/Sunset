"use client";

import { GameMode, GetUserByIdFavouritesResponse } from "@/lib/types/api";
import useSWRInfinite from "swr/infinite";

export function useUserFavourites(
  userId: number,
  mode: GameMode,
  limit?: number
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: GetUserByIdFavouritesResponse
  ) => {
    if (previousPageData && previousPageData.sets.length === 0) return null;

    const queryParams = new URLSearchParams({
      mode: mode.toString(),
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/${userId}/favourites?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetUserByIdFavouritesResponse>(getKey);
}
