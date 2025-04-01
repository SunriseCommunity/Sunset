"use client";

import { BeatmapSet, PlayedBeatmap } from "@/lib/hooks/api/beatmap/types";
import { GameMode } from "@/lib/hooks/api/types";
import useSWRInfinite from "swr/infinite";

export function useUserFavourites(
  userId: number,
  mode: GameMode,
  limit?: number
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: { sets: BeatmapSet[] }
  ) => {
    if (previousPageData && previousPageData.sets.length === 0) return null;

    const queryParams = new URLSearchParams({
      mode: mode.toString(),
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/${userId}/favourites?${queryParams.toString()}`;
  };

  return useSWRInfinite<{ sets: BeatmapSet[]; total_count: number }>(getKey);
}
