"use client";

import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { GetBeatmapByIdPpData, PerformanceAttributes } from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";

export function useBeatmapPp(
  beatmapId: number | null,
  query: GetBeatmapByIdPpData["query"],
  options?: SWRConfiguration,
) {
  const params = buildQuery(query);

  return useSWR<PerformanceAttributes>(
    beatmapId ? `beatmap/${beatmapId}/pp${params}` : null,
    fetcher,
    {
      ...options,
    },
  );
}
