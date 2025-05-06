"use client";

import { GameMode, GetUserByUserIdGraphResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useUserGraph(userId: number, mode: GameMode) {
  return useSWR<GetUserByUserIdGraphResponse>(`user/${userId}/graph?mode=${mode}`);
}
