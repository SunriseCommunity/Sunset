import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type {
  GetScoreProcessingData,
  ScoreProcessingTasksResponse,
} from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";

export interface ScoreProcessingTaskFilters extends Omit<NonNullable<GetScoreProcessingData["query"]>, "page" | "limit"> {}

export interface ScoreProcessingTaskParams extends ScoreProcessingTaskFilters {
  page: number;
  limit: number;
}

export function useScoreProcessingTasks(
  params: ScoreProcessingTaskParams,
  options?: SWRConfiguration,
) {
  const queryString = buildQuery({
    page: params.page,
    limit: params.limit,
    status: params.status,
    task_type: params.task_type,
    score_id: params.score_id,
    task_id: params.task_id,
  });

  return useSWR<ScoreProcessingTasksResponse>(`score-processing${queryString}`, fetcher, { ...options });
}
