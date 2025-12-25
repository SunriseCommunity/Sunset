"use client";

import useSWR from "swr";

import type { GameMode, GetUserByIdGradesResponse } from "@/lib/types/api";

export function useUserGrades(userId: number, mode: GameMode) {
  return useSWR<GetUserByIdGradesResponse>(
    `user/${userId}/grades?mode=${mode}`,
  );
}
