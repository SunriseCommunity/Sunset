import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { BulkScoreProcessingByFilterRequest, BulkScoreProcessingRequest, BulkScoreProcessingResultResponse, CreateScoreProcessingTaskRequest, ScoreProcessingTaskResponse } from "@/lib/types/api";

export function useCreateScoreProcessingTask() {
  return useSWRMutation(
    "score-processing/create",
    async (_key: string, { arg }: { arg: CreateScoreProcessingTaskRequest }) => {
      return poster<ScoreProcessingTaskResponse>("score-processing", { json: arg });
    },
  );
}

export function useCancelScoreProcessingTask(taskId: number) {
  return useSWRMutation(
    `score-processing/${taskId}/cancel`,
    async (url: string) => poster(url),
  );
}

export function useRequeueScoreProcessingTask(taskId: number) {
  return useSWRMutation(
    `score-processing/${taskId}/requeue`,
    async (url: string) => poster(url),
  );
}

export function useBulkScoreProcessing() {
  return useSWRMutation(
    "score-processing/bulk",
    async (_key: string, { arg }: { arg: BulkScoreProcessingRequest }) => {
      return poster<BulkScoreProcessingResultResponse>("score-processing/bulk", { json: arg });
    },
  );
}

export function useBulkScoreProcessingByFilter() {
  return useSWRMutation(
    "score-processing/bulk-by-filter",
    async (_key: string, { arg }: { arg: BulkScoreProcessingByFilterRequest }) => {
      return poster("score-processing/bulk-by-filter", { json: arg });
    },
  );
}
