"use client";

import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { GameMode } from "@/lib/hooks/api/types";
import { User } from "@/lib/hooks/api/user/types";
import fetcher from "@/lib/services/fetcher";
import useSWR, { SWRConfiguration } from "swr";

export function useBeatmapsetSearch(
  query: string | null,
  page?: number,
  limit?: number,
  status?: number[],
  mode?: GameMode,
  options?: SWRConfiguration
) {
  return useSWR<{ sets: BeatmapSet[] }>(
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
