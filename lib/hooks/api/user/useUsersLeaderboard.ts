"use client";

import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type {
  GameMode,
  GetUserLeaderboardResponse,
  LeaderboardSortType,
} from "@/lib/types/api";

export function useUsersLeaderboard(
  mode: GameMode,
  type: LeaderboardSortType,
  page?: number,
  limit?: number,
) {
  return useSWR<GetUserLeaderboardResponse>(
    `user/leaderboard?mode=${mode}&type=${type}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }`,
    fetcher,
    {
      keepPreviousData: true,
    },
  );
}
