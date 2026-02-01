"use client";

import useSWR from "swr";

import type { GetUserByUserIdPlayHistoryGraphResponse } from "@/lib/types/api";

export function useUserPlayHistoryGraph(userId: number) {
  return useSWR<GetUserByUserIdPlayHistoryGraphResponse>(`user/${userId}/play-history-graph`);
}
