"use client";

import fetcher from "@/lib/services/fetcher";
import {
  GameMode,
  GetUserLeaderboardResponse,
  LeaderboardSortType,
} from "@/lib/types/api";
import useSWR from "swr";

export function useUsersLeaderboard(
  mode: GameMode,
  type: LeaderboardSortType,
  page?: number,
  limit?: number
) {
  return useSWR<GetUserLeaderboardResponse>(
    `user/leaderboard?mode=${mode}&type=${type}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
}
