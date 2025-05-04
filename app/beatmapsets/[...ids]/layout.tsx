import { Metadata } from "next";
import Page, { BeatmapsetProps } from "./page";
import { notFound } from "next/navigation";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import fetcher from "@/lib/services/fetcher";
import { BeatmapSetResponse } from "@/lib/types/api";

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
