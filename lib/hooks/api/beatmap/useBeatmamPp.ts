"use client";

import { PerformanceAttributes } from "@/lib/hooks/api/beatmap/calculator.types";
import { Score } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
import fetcher from "@/lib/services/fetcher";
import useSWR, { SWRConfiguration } from "swr";

export function useBeatmamPp(
  beatmapId: number | null,
  mode: GameMode,
  mods?: number,
  combo?: number,
  misses?: number,
  accuracy?: number,
  options?: SWRConfiguration
) {
  return useSWR<PerformanceAttributes>(
    beatmapId
      ? `beatmap/${beatmapId}/pp?mode=${mode}${
          mods != undefined ? `&mods=${mods}` : ""
        }${combo != undefined ? `&combo=${combo}` : ""}${
          misses != undefined ? `&misses=${misses}` : ""
        }${accuracy != undefined ? `&accuracy=${accuracy}` : ""}`
      : null,
    fetcher,
    {
      ...options,
    }
  );
}
