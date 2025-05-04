"use client";

import fetcher from "@/lib/services/fetcher";
import { GameMode, GetBeatmapsetSearchResponse } from "@/lib/types/api";
import useSWR, { SWRConfiguration } from "swr";

export function useBeatmapsetSearch(
  query: string | null,
  page?: number,
  limit?: number,
  status?: number[],
  mode?: GameMode,
  options?: SWRConfiguration
) {
  return useSWR<GetBeatmapsetSearchResponse>(
    query
      ? `beatmapset/search?query=${query}${page ? `&page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }${mode != undefined ? `&mode=${mode}` : ""}${
          status != undefined ? `&status=${status.join("&status=")}` : ""
        }`
      : null,
    fetcher,
    {
      ...options,
    }
  );
}
