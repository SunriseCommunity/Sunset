import type { SWRInfiniteConfiguration } from "swr/infinite";
import useSWRInfinite from "swr/infinite";

import type { GetScoreProcessingData, ScoreProcessingTasksResponse } from "@/lib/types/api";

export function useScoreProcessingTasks(
  filters: Omit<NonNullable<GetScoreProcessingData["query"]>, "page" | "limit">,
  limit = 20,
  options?: SWRInfiniteConfiguration,
) {
  const getKey = (
    pageIndex: number,
    previousPageData: ScoreProcessingTasksResponse | null,
  ) => {
    if (previousPageData && previousPageData.tasks.length === 0)
      return null;

    const params = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: limit.toString(),
    });

    if (filters.status)
      params.append("status", filters.status);
    if (filters.task_type)
      params.append("task_type", filters.task_type);
    if (filters.score_id)
      params.append("score_id", filters.score_id.toString());
    if (filters.task_id)
      params.append("task_id", filters.task_id.toString());

    return `score-processing?${params.toString()}`;
  };

  return useSWRInfinite<ScoreProcessingTasksResponse>(getKey, options);
}
