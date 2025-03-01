import { Metadata } from "next";
import Page, { BeatmapsetProps } from "./page";
import { notFound } from "next/navigation";
import { getBeatmapSet } from "@/lib/actions/getBeatmapSet";

export async function generateMetadata({
  params,
}: BeatmapsetProps): Promise<Metadata> {
  const [beatmapSetId, beatmapId] = params.ids;

  if (!beatmapSetId || isNaN(beatmapSetId as any)) return notFound();

  const beatmapSet = await getBeatmapSet(beatmapSetId).then((res) => {
    if (res.error || !res.data) {
      return notFound();
    }

    return res.data;
  });

  const beatmap = beatmapId
    ? beatmapSet.beatmaps.find(
        (beatmap) => beatmap.id === parseInt(beatmapId as any)
      )
    : null;

  return {
    title: `${beatmapSet.artist} - ${beatmapSet.title} | osu!Sunrise`,
    description: `Beatmapset info for ${beatmapSet.title} by ${beatmapSet.artist}`,
    openGraph: {
      title: `${beatmapSet.artist} - ${beatmapSet.title} ${
        beatmap ? `[${beatmap.version}]` : ""
      } | osu!Sunrise`,
      description: `Beatmapset info for ${beatmapSet.title} by ${beatmapSet.artist}`,
      images: [
        `https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/cover.jpg`,
      ],
    },
  };
}

export default Page;
