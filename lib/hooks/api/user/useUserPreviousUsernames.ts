"use client";

import useSWR from "swr";

import type { GetUserByIdPreviousUsernamesResponse } from "@/lib/types/api";

export function useUserPreviousUsernames(userId: number) {
  return useSWR<GetUserByIdPreviousUsernamesResponse>(
    `user/${userId}/previous-usernames`,
  );
}
