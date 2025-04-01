"use client";

import { User } from "@/lib/hooks/api/user/types";
import useSWR from "swr";

export function useUserSearch(
  query: string | null,
  page?: number,
  limit?: number
) {
  return useSWR<User[]>(
    query
      ? `user/search?query=${query}${page ? `&page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        } `
      : null
  );
}
