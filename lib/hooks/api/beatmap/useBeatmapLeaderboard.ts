"use client";

import { Score } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
import useSWR from "swr";

export function useBeatmapLeaderboard(
  beatmapId: number | null,
  mode: GameMode,
  mods?: number,
  limit?: number
) {
  return useSWR<{
    scores: Score[];
    total_count: number;
  }>(
    beatmapId
      ? `beatmap/${beatmapId}/leaderboard?mode=${mode}${
          mods ? `&mods=${mods}` : ""
        }${limit ? `&limit=${limit}` : ""}`
      : null
  );
}
