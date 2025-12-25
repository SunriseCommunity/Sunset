"use client";

import useSWR from "swr";

import type { GameMode, GetUserByUserIdGraphResponse } from "@/lib/types/api";

export function useUserGraph(userId: number, mode: GameMode) {
  return useSWR<GetUserByUserIdGraphResponse>(`user/${userId}/graph?mode=${mode}`);
}
