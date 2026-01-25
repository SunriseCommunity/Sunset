"use client";

import useSWR from "swr";

import type { BeatmapResponse } from "@/lib/types/api";

import { useToastApiRequestFailed } from "../../useToastApiRequestFailed";

export function useBeatmap(beatmapId: number | null) {
  const swrResult = useSWR<BeatmapResponse>(
    beatmapId ? `beatmap/${beatmapId}` : null,
    {
      dedupingInterval: 1000 * 60 * 10,
    },
  );

  useToastApiRequestFailed(swrResult);

  return swrResult;
}
