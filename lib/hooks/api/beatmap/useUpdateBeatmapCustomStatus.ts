"use client";

import poster from "@/lib/services/poster";
import { PostBeatmapUpdateCustomStatusData } from "@/lib/types/api";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import useSWRMutation from "swr/mutation";

export function useUpdateBeatmapCustomStatus(beatmapSetId: number) {
  return useSWRMutation(
    `beatmap/update-custom-status`,
    async (
      url: string,
      { arg }: { arg: PostBeatmapUpdateCustomStatusData["body"] }
    ) => {
      await updateBeatmapSetFavouriteStatus(url, { arg });

      mutate(`beatmapset/${beatmapSetId}`);

      // NOTE: Need to implement more robust solution in the future.
      mutate(unstable_serialize((_) => `beatmapset/events?page=1&limit=5`));
      mutate(
        unstable_serialize(
          (_) => `beatmapset/${beatmapSetId}/events?page=1&limit=5`
        )
      );

      arg?.ids.forEach((id) => mutate(`beatmap/${id}`));
    }
  );
}

const updateBeatmapSetFavouriteStatus = async (
  url: string,
  { arg }: { arg: PostBeatmapUpdateCustomStatusData["body"] }
) => {
  await poster(url, {
    json: {
      ...arg,
    },
  });
};
