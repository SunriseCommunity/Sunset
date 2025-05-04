"use client";

import fetcher from "@/lib/services/fetcher";
import {
  GetBeatmapByIdLeaderboardData,
  GetBeatmapByIdLeaderboardResponse,
} from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";
import useSWR, { SWRConfiguration } from "swr";

export function useBeatmapLeaderboard(
  beatmapId: number | null,
  query: GetBeatmapByIdLeaderboardData["query"],
  options?: SWRConfiguration
) {
  const params = buildQuery(query);

  return useSWR<GetBeatmapByIdLeaderboardResponse>(
    beatmapId ? `beatmap/${beatmapId}/leaderboard${params}` : null,
    fetcher,
    {
      ...options,
    }
  );
}
