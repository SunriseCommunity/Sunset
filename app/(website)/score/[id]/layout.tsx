import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getT } from "@/lib/i18n/utils";
import fetcher from "@/lib/services/fetcher";
import type { BeatmapResponse, ScoreResponse, UserResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

import Page from "./page";

export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const score = await fetcher<ScoreResponse>(`score/${params.id}`);

  if (!score) {
    return notFound();
  }

  const user = await fetcher<UserResponse>(`user/${score.user_id}`);

  if (!user) {
    return notFound();
  }

  const beatmap = await fetcher<BeatmapResponse>(`beatmap/${score.beatmap_id}`);

  if (!beatmap) {
    return notFound();
  }

  const t = await getT("pages.score.meta");
  const starRating = getBeatmapStarRating(beatmap).toFixed(2);
  const pp = score.performance_points.toFixed(2);

  return {
    title: t("title", {
      username: user.username,
      beatmapTitle: beatmap.title ?? "Unknown",
      beatmapVersion: beatmap.version,
    }),
    description: t("description", {
      username: user.username,
      pp,
      beatmapTitle: beatmap.title ?? "Unknown",
      beatmapVersion: beatmap.version,
    }),
    openGraph: {
      title: t("openGraph.title", {
        username: user.username,
        beatmapTitle: beatmap.title ?? "Unknown",
        beatmapArtist: beatmap.artist ?? "Unknown",
        beatmapVersion: beatmap.version,
      }),
      description: t("openGraph.description", {
        username: user.username,
        pp,
        beatmapTitle: beatmap.title ?? "Unknown",
        beatmapArtist: beatmap.artist ?? "Unknown",
        beatmapVersion: beatmap.version,
        starRating,
        mods: score.mods ?? "",
      }),
      images: [
        `https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/list@2x.jpg`,
      ],
    },
  };
}

export default Page;
