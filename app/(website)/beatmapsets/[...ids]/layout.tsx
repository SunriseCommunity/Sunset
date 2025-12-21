import { Metadata } from "next";
import Page, { BeatmapsetProps } from "./page";
import { notFound } from "next/navigation";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import fetcher from "@/lib/services/fetcher";
import { BeatmapSetResponse } from "@/lib/types/api";
import { getT } from "@/lib/i18n/utils";

export async function generateMetadata(
  props: BeatmapsetProps
): Promise<Metadata> {
  const params = await props.params;
  const [beatmapSetId, beatmapId] = params.ids;

  if (!beatmapSetId || isNaN(beatmapSetId as any)) return notFound();

  const beatmapSet = await fetcher<BeatmapSetResponse>(
    `beatmapset/${beatmapSetId}`
  );

  if (!beatmapSet) {
    return notFound();
  }

  const beatmap = beatmapId
    ? beatmapSet.beatmaps.find(
        (beatmap) => beatmap.id === parseInt(beatmapId as any)
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
        difficultyInfo: difficultyInfo,
      }),
      images: [
        `https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/list@2x.jpg`,
      ],
    },
  };
}

export default Page;
