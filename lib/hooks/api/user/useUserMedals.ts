"use client";


import { GameMode, GetUserByIdMedalsResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useUserMedals(userId: number, mode: GameMode) {
  return useSWR<GetUserByIdMedalsResponse>(`user/${userId}/medals?mode=${mode}`);
}
