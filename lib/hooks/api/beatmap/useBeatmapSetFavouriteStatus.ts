"use client";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import fetcher from "@/lib/services/fetcher";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function useBeatmapSetFavouriteStatus(beatmapSetId: number) {
  const { data } = useUserSelf();

  return useSWR<{
    favourited: boolean;
  }>(data ? `beatmapset/${beatmapSetId}/favourited` : null);
}

export function useUpdateBeatmapSetFavouriteStatus(beatmapSetId: number) {
  return useSWRMutation(
    `beatmapset/${beatmapSetId}/favourited`,
    updateBeatmapSetFavouriteStatus
  );
}

const updateBeatmapSetFavouriteStatus = async (
  url: string,
  { arg }: { arg: { favourite: boolean } }
) => {
  await fetcher(url.replace("/favourited", ""), {
    searchParams: {
      favourite: arg.favourite,
    },
  });
};
