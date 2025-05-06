"use client";

import { BeatmapSetResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useBeatmapSet(beatmapSetId: number | null) {
  return useSWR<BeatmapSetResponse>(
    beatmapSetId ? `beatmapset/${beatmapSetId}` : null,
    {
      dedupingInterval: 1000 * 60 * 10,
    }
  );
}
