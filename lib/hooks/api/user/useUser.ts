"use client";

import { GameMode, UserResponse, UserWithStats } from "@/lib/types/api";
import useSWR from "swr";

export function useUserSelf() {
  return useSWR<UserResponse>("user/self");
}

export function useUser(id: number | null) {
  return useSWR<UserResponse>(id ? `user/${id}` : null);
}

export function useUserStats(id: number | null, mode: GameMode | null) {
  return useSWR<UserWithStats>(id && mode ? `user/${id}/${mode}` : null);
}
