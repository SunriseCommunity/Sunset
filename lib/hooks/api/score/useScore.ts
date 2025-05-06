"use client";


import { ScoreResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useScore(scoreId: number) {
  return useSWR<ScoreResponse>(`score/${scoreId}`);
}
