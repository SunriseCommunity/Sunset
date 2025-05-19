"use client";

import poster from "@/lib/services/poster";
import { PostBeatmapUpdateCustomStatusData } from "@/lib/types/api";
import { mutate } from "swr";
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
