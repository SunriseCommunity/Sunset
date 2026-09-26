import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { ScoreProcessingStatsResponse } from "@/lib/types/api";

export function useScoreProcessingStats(options?: SWRConfiguration) {
  return useSWR<ScoreProcessingStatsResponse>("score-processing/stats", fetcher, { ...options });
}
