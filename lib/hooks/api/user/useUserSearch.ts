"use client";

import fetcher from "@/lib/services/fetcher";
import { GetUserSearchResponse } from "@/lib/types/api";
import useSWR, { SWRConfiguration } from "swr";

export function useUserSearch(
  query: string | null,
  page?: number,
  limit?: number,
  options?: SWRConfiguration
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
    }
  );
}
