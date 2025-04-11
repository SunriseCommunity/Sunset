import { Metadata } from "next";
import Page from "./page";
import { notFound } from "next/navigation";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import fetcher from "@/lib/services/fetcher";
import { User } from "@/lib/hooks/api/user/types";
import { Score } from "@/lib/hooks/api/score/types";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";

export const revalidate = 60;

export async function generateMetadata(
  props: {
    params: Promise<{ id: number }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const score = await fetcher<Score>(`score/${params.id}`);

  if (!score) {
    return notFound();
  }

  if (!score) return notFound();

  const user = await fetcher<User>(`user/${score.user_id}`);

  if (!user) {
    return notFound();
  }

  const beatmap = await fetcher<Beatmap>(`beatmap/${score.beatmap_id}`);

  if (!beatmap) {
    return notFound();
  }

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
