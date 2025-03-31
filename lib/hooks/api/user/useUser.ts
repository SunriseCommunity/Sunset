"use client";

import { User, UserStats } from "@/lib/hooks/api/user/types";
import { GameMode } from "@/lib/hooks/api/types";
import useSWR from "swr";

export function useUserSelf() {
  return useSWR<User>("user/self");
}

export function useUser(id: number) {
  return useSWR<User>(`user/${id}`);
}

export function useUserStats(id: number, mode: GameMode) {
  return useSWR<{ user: User; stats: UserStats }>(`user/${id}?mode=${mode}`);
}
