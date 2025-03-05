import { Metadata } from "next";
import Page from "./page";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/actions/getUser";
import { getScore } from "@/lib/actions/getScore";
import { getBeatmap } from "@/lib/actions/getBeatmap";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  const score = await getScore(params.id).then((res) => {
    if (res.error) {
      return notFound();
    } else {
      return res.data;
    }
  });

  if (!score) return notFound();

  const user = await getUser(score?.user_id).then((res) => {
    if (res.error) {
      return notFound();
    } else {
      return res.data;
    }
  });

  if (!user) return notFound();

  const beatmap = await getBeatmap(score.beatmap_id).then((res) => {
    if (res.error) {
      return notFound();
    } else {
      return res.data;
    }
  });

  if (!beatmap) return notFound();

  return {
    title: `${user.username} on ${beatmap.title} [${beatmap.version}] | osu!Sunrise`,
    description: `User ${
      user.username
    } has scored ${score.performance_points.toFixed(2)}pp on ${
      beatmap.title
    } [${beatmap.version}] in osu!Sunrise.`,
    openGraph: {
      title: `${user.username} on ${beatmap.title} - ${beatmap.artist} [${beatmap.version}] | osu!Sunrise`,
      description: `User ${
        user.username
      } has scored ${score.performance_points.toFixed(2)}pp on ${
        beatmap.title
      } - ${beatmap.artist} [${beatmap.version}] ★${getBeatmapStarRating(
        beatmap
      ).toFixed(2)} ${score.mods} in osu!Sunrise.`,
      images: [
        `https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/list@2x.jpg`,
      ],
    },
  };
}

export default Page;
