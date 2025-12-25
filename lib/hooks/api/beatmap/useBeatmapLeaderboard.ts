"use client";

import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type {
  GetBeatmapByIdLeaderboardData,
  GetBeatmapByIdLeaderboardResponse,
} from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";

export function useBeatmapLeaderboard(
  beatmapId: number | null,
  query: GetBeatmapByIdLeaderboardData["query"],
  options?: SWRConfiguration,
) {
  const params = buildQuery(query);

  return useSWR<GetBeatmapByIdLeaderboardResponse>(
    beatmapId ? `beatmap/${beatmapId}/leaderboard${params}` : null,
    fetcher,
    {
      ...options,
    },
  );
}
