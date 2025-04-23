"use client";

import { User } from "@/lib/hooks/api/user/types";
import fetcher from "@/lib/services/fetcher";
import useSWR, { SWRConfiguration } from "swr";

export function useUserSearch(
  query: string | null,
  page?: number,
  limit?: number,
  options?: SWRConfiguration
) {
  return useSWR<User[]>(
    query
      ? `user/search?query=${query}${page ? `&page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        } `
      : null,
    fetcher,
    {
      ...options,
    }
  );
}
