"use client";

import { GetUserByIdPreviousUsernamesResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useUserPreviousUsernames(userId: number) {
  return useSWR<GetUserByIdPreviousUsernamesResponse>(
    `user/${userId}/previous-usernames`
  );
}
