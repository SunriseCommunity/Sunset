"use client";

import useSWR from "swr";

export function useServerStatus() {
  return useSWR<{
    is_online: boolean;
    users_online: number;
    total_users: number;
  }>("status");
}
