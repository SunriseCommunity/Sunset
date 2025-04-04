"use client";

import { UserGraph, UserMedals } from "@/lib/hooks/api/user/types";
import { GameMode } from "@/lib/hooks/api/types";
import useSWR from "swr";

export function useUserMedals(userId: number, mode: GameMode) {
  return useSWR<UserMedals>(`user/${userId}/medals?mode=${mode}`);
}
