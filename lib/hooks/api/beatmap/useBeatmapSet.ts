"use client";

import useSWR from "swr";

import type { BeatmapSetResponse } from "@/lib/types/api";

export function useBeatmapSet(beatmapSetId: number | null) {
  return useSWR<BeatmapSetResponse>(
    beatmapSetId ? `beatmapset/${beatmapSetId}` : null,
    {
      dedupingInterval: 1000 * 60 * 10,
    },
  );
}
