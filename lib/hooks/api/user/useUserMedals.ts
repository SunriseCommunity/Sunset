"use client";

import useSWR from "swr";

import type { GameMode, GetUserByIdMedalsResponse } from "@/lib/types/api";

export function useUserMedals(userId: number, mode: GameMode) {
  return useSWR<GetUserByIdMedalsResponse>(`user/${userId}/medals?mode=${mode}`);
}
