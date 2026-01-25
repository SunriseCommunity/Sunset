"use client";

import useSWR from "swr";

import type { BeatmapSetResponse } from "@/lib/types/api";

import { useToastApiRequestFailed } from "../../useToastApiRequestFailed";

export function useBeatmapSet(beatmapSetId: number | null) {
  const swrResult = useSWR<BeatmapSetResponse>(
    beatmapSetId ? `beatmapset/${beatmapSetId}` : null,
    {
      dedupingInterval: 1000 * 60 * 10,
    },
  );

  useToastApiRequestFailed(swrResult);

  return swrResult;
}
