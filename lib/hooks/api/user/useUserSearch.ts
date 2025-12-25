"use client";

import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { GetUserSearchResponse } from "@/lib/types/api";

export function useUserSearch(
  query: string | null,
  page?: number,
  limit?: number,
  options?: SWRConfiguration,
) {
  return useSWR<GetUserSearchResponse>(
    query
      ? `user/search?query=${query}${page ? `&page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        } `
      : null,
    fetcher,
    {
      ...options,
    },
  );
}
