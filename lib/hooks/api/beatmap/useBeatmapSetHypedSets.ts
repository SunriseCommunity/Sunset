"use client";

import useSWRInfinite from "swr/infinite";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import type { GetBeatmapsetGetHypedSetsResponse } from "@/lib/types/api";

export function useBeatmapSetGetHypedSets(limit?: number) {
  const { data } = useUserSelf();

  const getKey = (
    pageIndex: number,
    previousPageData?: GetBeatmapsetGetHypedSetsResponse,
  ) => {
    if (!data)
      return null;
    if (previousPageData && previousPageData.sets.length === 0)
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });
    if (limit)
      queryParams.append("limit", limit.toString());

    return `beatmapset/get-hyped-sets?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetBeatmapsetGetHypedSetsResponse>(getKey);
}
