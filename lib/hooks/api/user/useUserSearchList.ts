"use client";

import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { GetUserSearchListResponse } from "@/lib/types/api";

export function useUserSearchList(
  query?: string,
  page?: number,
  limit?: number,
  options?: SWRConfiguration,
) {
  const queryParams = new URLSearchParams();
  if (query)
    queryParams.append("query", query);
  if (limit)
    queryParams.append("limit", limit.toString());
  if (page)
    queryParams.append("page", page.toString());

  return useSWR<GetUserSearchListResponse>(
    `user/search/list?${queryParams}`,
    fetcher,
    {
      ...options,
    },
  );
}
