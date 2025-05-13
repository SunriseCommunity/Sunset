"use client";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import {
  BeatmapSetHypeCountResponse,
  GetUserInventoryItemResponse,
  ItemType,
} from "@/lib/types/api";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export function useGetUserHypes() {
  const { data } = useUserSelf();

  return useSWR<GetUserInventoryItemResponse>(
    data ? `user/inventory/item?type=${ItemType.HYPE}` : null
  );
}

export function useBeatmapSetHype(beatmapSetId: number | null) {
  return useSWR<BeatmapSetHypeCountResponse>(
    beatmapSetId ? `beatmapset/${beatmapSetId}/hype` : null
  );
}

export function useBeatmapSetAddHype(beatmapSetId: number) {
  const { data } = useUserSelf();

  return useSWRMutation(
    data ? `beatmapset/${beatmapSetId}/hype` : null,
    (url) => addBeatmapSetHype(url)
  );
}

const addBeatmapSetHype = async (url: string) => {
  await poster(url, {});
  mutate(url ? `user/inventory/item?type=${ItemType.HYPE}` : null);
};
