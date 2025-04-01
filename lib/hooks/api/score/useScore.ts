"use client";

import { Score } from "@/lib/hooks/api/score/types";
import useSWR from "swr";

export function useScore(scoreId: number) {
  return useSWR<Score>(`score/${scoreId}`);
}
