"use client";

import fetcher from "@/lib/services/fetcher";
import {
  BeatmapStatusWeb,
  GameMode,
  GetBeatmapsetSearchResponse,
} from "@/lib/types/api";
import useSWR, { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";

export function useBeatmapsetSearch(
  query: string,
  limit?: number,
  status?: BeatmapStatusWeb[],
  mode?: GameMode,
  options?: SWRConfiguration
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: GetBeatmapsetSearchResponse
  ) => {
    if (previousPageData && previousPageData.sets.length === 0) return null;
    if (limit === 0) return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });

    if (query) queryParams.append("query", query.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (mode) queryParams.append("mode", mode.toString());

    if (status && status.length > 0) {
      status.forEach((s) => queryParams.append("status", s));
    }

    return `beatmapset/search?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetBeatmapsetSearchResponse>(getKey, options);
}
