import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type { AdminScoresResponse, GetUserByIdScoresAdminData } from "@/lib/types/api";

export interface AdminUserScoresParams extends Omit<NonNullable<GetUserByIdScoresAdminData["query"]>, "page" | "limit"> {}

export function useAdminUserScores(
  userId: number,
  params: AdminUserScoresParams,
  page?: number,
  limit?: number,
  options?: SWRConfiguration,
) {
  const queryParams = new URLSearchParams({
    page: page?.toString() ?? "1",
    limit: limit?.toString() ?? "20",
  });

  if (params.mode)
    queryParams.append("mode", params.mode);
  if (params.mods)
    queryParams.append("mods", params.mods.toString());
  if (params.submission_status)
    queryParams.append("submission_status", params.submission_status);
  if (params.beatmap_status)
    queryParams.append("beatmap_status", params.beatmap_status);
  if (params.submitted_from)
    queryParams.append("submitted_from", params.submitted_from);
  if (params.submitted_to)
    queryParams.append("submitted_to", params.submitted_to);
  if (params.sort)
    queryParams.append("sort", params.sort);

  const queryString = queryParams.toString();
  const endpoint = `user/${userId}/scores/admin${queryString ? `?${queryString}` : ""}`;

  return useSWR<AdminScoresResponse>(endpoint, fetcher, { ...options });
}
