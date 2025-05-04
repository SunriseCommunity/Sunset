"use client";

import { GameMode, GetUserByIdScoresResponse, ScoreTableType } from "@/lib/types/api";
import useSWRInfinite from "swr/infinite";

export function useUserScores(
  userId: number,
  mode: GameMode,
  type: ScoreTableType,
  limit?: number
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: GetUserByIdScoresResponse
  ) => {
    if (previousPageData && previousPageData.scores.length === 0) return null;

    const queryParams = new URLSearchParams({
      mode: mode.toString(),
      type: type.toString(),
      page: (pageIndex + 1).toString(),
    });

    if (limit) queryParams.append("limit", limit.toString());

    return `user/${userId}/scores?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetUserByIdScoresResponse>(getKey);
}
