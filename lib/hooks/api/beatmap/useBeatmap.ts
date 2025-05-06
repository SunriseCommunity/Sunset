"use client";

import { BeatmapResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useBeatmap(beatmapId: number | null) {
  return useSWR<BeatmapResponse>(beatmapId ? `beatmap/${beatmapId}` : null, {
    dedupingInterval: 1000 * 60 * 10,
  });
}
