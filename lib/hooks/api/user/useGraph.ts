"use client";

import { GameMode, GetUserByIdGradesResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useUserGrades(userId: number, mode: GameMode) {
  return useSWR<GetUserByIdGradesResponse>(
    `user/${userId}/grades?mode=${mode}`
  );
}
