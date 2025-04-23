"use client";

import { User } from "@/lib/hooks/api/user/types";
import useSWR from "swr";

export function useServerStatus() {
  return useSWR<{
    is_online: boolean;
    users_online: number;
    current_users_online: User[];
    total_users: number;
    recent_users: User[];
    total_scores: number;
    total_restrictions: number;
  }>("status?detailed=true&includeRecentUsers=true");
}
