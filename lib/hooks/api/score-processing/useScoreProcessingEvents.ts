import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { EventScoreProcessingListResponse } from "@/lib/types/api";

export interface ScoreProcessingEventsParams {
  types?: string[] | null;
  scoreId?: number | null;
  page?: number;
  limit?: number;
}

export function useScoreProcessingEvents(
  params: ScoreProcessingEventsParams,
  options?: SWRConfiguration,
) {
  const queryParams = new URLSearchParams();

  if (params.page)
    queryParams.append("page", params.page.toString());
  if (params.limit)
    queryParams.append("limit", params.limit.toString());
  if (params.scoreId)
    queryParams.append("score_id", params.scoreId.toString());
  if (params.types && params.types.length > 0)
    params.types.forEach(type => queryParams.append("types", type));

  const queryString = queryParams.toString();
  const endpoint = `score-processing/events${queryString ? `?${queryString}` : ""}`;

  return useSWR<EventScoreProcessingListResponse>(endpoint, fetcher, { ...options });
}
