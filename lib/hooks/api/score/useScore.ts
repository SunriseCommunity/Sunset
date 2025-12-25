"use client";

import useSWR from "swr";

import type { ScoreResponse } from "@/lib/types/api";

export function useScore(scoreId: number) {
  return useSWR<ScoreResponse>(`score/${scoreId}`);
}
