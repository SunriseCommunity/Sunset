"use client";

import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import useSWR from "swr";

export function useBeatmap(beatmapId: number) {
  return useSWR<Beatmap>(`beatmap/${beatmapId}`, {
    dedupingInterval: 1000 * 60 * 10,
  });
}
