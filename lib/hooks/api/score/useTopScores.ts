"use client";

import useSWRInfinite from "swr/infinite";

import type { GameMode, GetScoreTopResponse } from "@/lib/types/api";

export function useTopScores(mode: GameMode, limit?: number) {
  const getKey = (
    pageIndex: number,
    previousPageData?: GetScoreTopResponse,
  ) => {
    if (previousPageData && previousPageData.scores.length === 0)
      return null;

    const queryParams = new URLSearchParams({
      mode: mode.toString(),
      page: (pageIndex + 1).toString(),
    });

    if (limit)
      queryParams.append("limit", limit.toString());

    return `score/top?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetScoreTopResponse>(getKey);
}
