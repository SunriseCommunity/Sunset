import { Metadata } from "next";
import Page, { BeatmapsetProps } from "./page";
import { notFound } from "next/navigation";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import fetcher from "@/lib/services/fetcher";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";

export async function generateMetadata({
  params,
}: BeatmapsetProps): Promise<Metadata> {
  const [beatmapSetId, beatmapId] = params.ids;

  if (!beatmapSetId || isNaN(beatmapSetId as any)) return notFound();

  const beatmapSet = await fetcher<BeatmapSet>(`beatmapset/${beatmapSetId}`);

  if (!beatmapSet) {
    return notFound();
  }

  const beatmap = beatmapId
    ? beatmapSet.beatmaps.find(
        (beatmap) => beatmap.id === parseInt(beatmapId as any)
      )
    : null;

  return {
    title: `${beatmapSet.artist} - ${beatmapSet.title} | osu!Sunrise`,
    description: `Beatmapset info for ${beatmapSet.title} by ${beatmapSet.artist}`,
    openGraph: {
      siteName: "osu!Sunrise",
      title: `${beatmapSet.artist} - ${beatmapSet.title} | osu!Sunrise`,
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
