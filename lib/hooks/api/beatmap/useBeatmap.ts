"use client";

import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import useSWR from "swr";

export function useBeatmap(beatmapId: number | null) {
  return useSWR<Beatmap>(beatmapId ? `beatmap/${beatmapId}` : null, {
    dedupingInterval: 1000 * 60 * 10,
  });
}
