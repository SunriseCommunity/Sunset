"use client";

import { Score } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
import fetcher from "@/lib/services/fetcher";
import useSWR, { SWRConfiguration } from "swr";

export function useBeatmapLeaderboard(
  beatmapId: number | null,
  mode: GameMode,
  mods?: number,
  limit?: number,
  options?: SWRConfiguration
) {
  return useSWR<{
    scores: Score[];
    total_count: number;
  }>(
    beatmapId
      ? `beatmap/${beatmapId}/leaderboard?mode=${mode}${
          mods != undefined ? `&mods=${mods}` : ""
        }${limit ? `&limit=${limit}` : ""}`
      : null,
    fetcher,
    {
      ...options,
    }
  );
}
