"use client";

import { UserGraph } from "@/lib/hooks/api/user/types";
import { GameMode } from "@/lib/types/GameMode";
import useSWR from "swr";

export function useUserGraph(userId: number, mode: GameMode) {
  return useSWR<UserGraph>(`user/${userId}/graph?mode=${mode}`);
}
