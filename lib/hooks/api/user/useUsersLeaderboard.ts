"use client";

import { GameMode } from "@/lib/hooks/api/types";
import {
  User,
  UsersLeaderboardType,
  UserStats,
} from "@/lib/hooks/api/user/types";
import useSWR from "swr";

export function useUsersLeaderboard(
  mode: GameMode,
  type: UsersLeaderboardType,
  page?: number,
  limit?: number
) {
  return useSWR<{
    users: {
      user: User;
      stats: UserStats;
    }[];
    total_count: number;
  }>(
    `user/leaderboard?mode=${mode}&type=${type}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }`
  );
}
