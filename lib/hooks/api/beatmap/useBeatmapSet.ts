"use client";

import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import useSWR from "swr";

export function useBeatmapSet(beatmapSetId: number | null) {
  return useSWR<BeatmapSet>(
    beatmapSetId ? `beatmapset/${beatmapSetId}` : null,
    {
      dedupingInterval: 1000 * 60 * 10,
    }
  );
}
