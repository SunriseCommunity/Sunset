"use client";

import { Score } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
import { UserScoresType } from "@/lib/hooks/api/user/types";
import useSWRInfinite from "swr/infinite";

export function useUserScores(
  userId: number,
  mode: GameMode,
  type: UserScoresType,
  limit?: number
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: { scores: Score[] }
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

  return useSWRInfinite<{ scores: Score[]; total_count: number }>(getKey);
}
