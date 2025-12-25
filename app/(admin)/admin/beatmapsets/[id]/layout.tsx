import type { Metadata } from "next";
import { notFound } from "next/navigation";

import fetcher from "@/lib/services/fetcher";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

import type { BeatmapsetProps } from "./page";
import Page from "./page";

export async function generateMetadata(
  props: BeatmapsetProps,
): Promise<Metadata> {
  const params = await props.params;
  const beatmapSetId = params.id;

  if (!beatmapSetId || Number.isNaN(beatmapSetId as any))
    return notFound();

  const beatmapSet = await fetcher<BeatmapSetResponse>(
    `beatmapset/${beatmapSetId}`,
  );

  if (!beatmapSet) {
    return notFound();
  }

  const beatmap = beatmapSet.beatmaps.pop();

  if (!beatmap) {
    return notFound();
  }

  return {
    title: `${beatmapSet.artist} - ${beatmapSet.title} | osu!sunrise`,
    description: `Beatmapset info for ${beatmapSet.title} by ${beatmapSet.artist}`,
    openGraph: {
      siteName: "osu!sunrise",
      title: `${beatmapSet.artist} - ${beatmapSet.title} | osu!sunrise`,
      description: `Beatmapset info for ${beatmapSet.title} by ${
        beatmapSet.artist
      } ${
        beatmap
          ? `[${beatmap.version}] ★${getBeatmapStarRating(beatmap).toFixed(2)}`
          : ""
      }`,
      images: [
        `https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/list@2x.jpg`,
      ],
    },
  };
}

export default Page;
