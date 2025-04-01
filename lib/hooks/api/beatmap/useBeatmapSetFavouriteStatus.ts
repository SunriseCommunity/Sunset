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
    (_, { arg }: { arg: { favourite: boolean } }) =>
      updateBeatmapSetFavouriteStatus(beatmapSetId, { arg })
  );
}

const updateBeatmapSetFavouriteStatus = async (
  beatmapSetId: number,
  { arg }: { arg: { favourite: boolean } }
) => {
  await fetcher(`beatmapset/${beatmapSetId}`, {
    searchParams: {
      favourite: arg.favourite,
    },
  });
};
