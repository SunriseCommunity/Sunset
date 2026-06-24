import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { AdminScoresResponse, GetUserByIdScoresAdminData } from "@/lib/types/api";
import { buildQuery } from "@/lib/utils/buildQuery";

export interface AdminUserScoresParams extends Omit<NonNullable<GetUserByIdScoresAdminData["query"]>, "page" | "limit"> {}

export function useAdminUserScores(
  userId: number,
  params: AdminUserScoresParams,
  page?: number,
  limit?: number,
  options?: SWRConfiguration,
) {
  const queryString = buildQuery({
    ...params,
    page: page ?? 1,
    limit: limit ?? 20,
  });
  const endpoint = `user/${userId}/scores/admin${queryString}`;

  return useSWR<AdminScoresResponse>(endpoint, fetcher, { ...options });
}
