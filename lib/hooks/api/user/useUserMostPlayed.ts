"use client";

import { PlayedBeatmap } from "@/lib/hooks/api/beatmap/types";
import { GameMode } from "@/lib/hooks/api/types";
import useSWRInfinite from "swr/infinite";

export function useUserMostPlayed(
  userId: number,
  mode: GameMode,
  limit?: number
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: { most_played: PlayedBeatmap[] }
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

  return useSWRInfinite<{ most_played: PlayedBeatmap[]; total_count: number }>(
    getKey
  );
}
