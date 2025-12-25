"use client";

import useSWRInfinite from "swr/infinite";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import type { GetBeatmapsetByIdEventsResponse } from "@/lib/types/api";

export function useBeatmapsSetEvents(limit?: number) {
  const { data } = useUserSelf();

  const getKey = (
    pageIndex: number,
    previousPageData?: GetBeatmapsetByIdEventsResponse,
  ) => {
    if (!data)
      return null;
    if (previousPageData && previousPageData.events.length === 0)
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });
    if (limit)
      queryParams.append("limit", limit.toString());

    return `beatmapset/events?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetBeatmapsetByIdEventsResponse>(getKey);
}
