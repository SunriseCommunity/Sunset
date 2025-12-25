import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getT } from "@/lib/i18n/utils";
import fetcher from "@/lib/services/fetcher";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

import type { BeatmapsetProps } from "./page";
import Page from "./page";

export async function generateMetadata(
  props: BeatmapsetProps,
): Promise<Metadata> {
  const params = await props.params;
  const [beatmapSetId, beatmapId] = params.ids;

  if (!beatmapSetId || Number.isNaN(beatmapSetId as any))
    return notFound();

  const beatmapSet = await fetcher<BeatmapSetResponse>(
    `beatmapset/${beatmapSetId}`,
  );

  if (!beatmapSet) {
    return notFound();
  }

  const beatmap = beatmapId
    ? beatmapSet.beatmaps.find(
        beatmap => beatmap.id === Number.parseInt(beatmapId, 10),
      )
    : null;

  const t = await getT("pages.beatmapsets.meta");

  const difficultyInfo = beatmap
    ? `[${beatmap.version}] ★${getBeatmapStarRating(beatmap).toFixed(2)}`
    : "";

  return {
    title: t("title", {
      artist: beatmapSet.artist,
      title: beatmapSet.title,
    }),
    description: t("description", {
      title: beatmapSet.title,
      artist: beatmapSet.artist,
    }),
    openGraph: {
      siteName: "osu!sunrise",
      title: t("openGraph.title", {
        artist: beatmapSet.artist,
        title: beatmapSet.title,
      }),
      description: t("openGraph.description", {
        title: beatmapSet.title,
        artist: beatmapSet.artist,
        difficultyInfo,
      }),
      images: [
        `https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/list@2x.jpg`,
      ],
    },
  };
}

export default Page;
