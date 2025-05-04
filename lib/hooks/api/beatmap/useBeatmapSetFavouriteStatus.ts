"use client";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";

import {
  GetBeatmapsetByIdFavouritedResponse,
  PostBeatmapsetByIdFavouritedData,
} from "@/lib/types/api";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function useBeatmapSetFavouriteStatus(beatmapSetId: number) {
  const { data } = useUserSelf();

  return useSWR<GetBeatmapsetByIdFavouritedResponse>(
    data ? `beatmapset/${beatmapSetId}/favourited` : null
  );
}

export function useUpdateBeatmapSetFavouriteStatus(beatmapSetId: number) {
  return useSWRMutation(
    `beatmapset/${beatmapSetId}/favourited`,
    (_, { arg }: { arg: PostBeatmapsetByIdFavouritedData["body"] }) =>
      updateBeatmapSetFavouriteStatus(beatmapSetId, { arg })
  );
}

const updateBeatmapSetFavouriteStatus = async (
  beatmapSetId: number,
  { arg }: { arg: PostBeatmapsetByIdFavouritedData["body"] }
) => {
  await poster(`beatmapset/${beatmapSetId}/favourited`, {
    json: {
      ...arg,
    },
  });
};
