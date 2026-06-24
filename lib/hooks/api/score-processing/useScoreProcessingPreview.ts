import useSWR from "swr";

import type { ScoreProcessingPreviewResponse } from "@/lib/types/api";

export function useScoreProcessingPreview(scoreId: number | null) {
  return useSWR<ScoreProcessingPreviewResponse>(
    scoreId && scoreId > 0 ? `score-processing/score/${scoreId}` : null,
  );
}
