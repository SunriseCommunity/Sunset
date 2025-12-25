"use client";

import useSWR from "swr";

import type { BeatmapResponse } from "@/lib/types/api";

export function useBeatmap(beatmapId: number | null) {
  return useSWR<BeatmapResponse>(beatmapId ? `beatmap/${beatmapId}` : null, {
    dedupingInterval: 1000 * 60 * 10,
  });
}
