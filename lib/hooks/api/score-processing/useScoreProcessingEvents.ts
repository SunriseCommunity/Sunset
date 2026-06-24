import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { EventScoreProcessingListResponse, GetScoreProcessingEventsData } from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";

export interface ScoreProcessingEventsParams extends Omit<NonNullable<GetScoreProcessingEventsData["query"]>, "score_id"> {
  scoreId?: number | null;
}

export function useScoreProcessingEvents(
  params: ScoreProcessingEventsParams,
  options?: SWRConfiguration,
) {
  const queryString = buildQuery({
    page: params.page,
    limit: params.limit,
    score_id: params.scoreId,
    types: params.types,
  });
  const endpoint = `score-processing/events${queryString}`;

  return useSWR<EventScoreProcessingListResponse>(endpoint, fetcher, { ...options });
}
