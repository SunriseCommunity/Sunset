"use client";

import { User, UserStats } from "@/lib/hooks/api/user/types";
import { GameMode } from "@/lib/hooks/api/types";
import useSWR from "swr";

export function useUserSelf() {
  return useSWR<User>("user/self");
}

export function useUser(id: number | null) {
  return useSWR<User>(id ? `user/${id}` : null);
}

export function useUserStats(id: number | null, mode: GameMode) {
  return useSWR<{ user: User; stats: UserStats }>(
    id ? `user/${id}?mode=${mode}` : null
  );
}
