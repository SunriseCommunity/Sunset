"use client";

import fetcher from "@/lib/services/fetcher";
import { GetBeatmapByIdPpData, PerformanceAttributes } from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";
import useSWR, { SWRConfiguration } from "swr";

export function useBeatmapPp(
  beatmapId: number | null,
  query: GetBeatmapByIdPpData["query"],
  options?: SWRConfiguration
) {
  const params = buildQuery(query);

  return useSWR<PerformanceAttributes>(
    beatmapId ? `beatmap/${beatmapId}/pp${params}` : null,
    fetcher,
    {
      ...options,
    }
  );
}
