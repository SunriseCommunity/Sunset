"use client";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import {
  BeatmapSetResponse,
  PostBeatmapsetGetHypedSetsResponse,
} from "@/lib/types/api";
import useSWR from "swr";

export function useBeatmapSetGetHypedSets() {
  const self = useUserSelf();

  return useSWR<PostBeatmapsetGetHypedSetsResponse>(
    self ? `beatmapset/get-hyped-sets` : null
  );
}
