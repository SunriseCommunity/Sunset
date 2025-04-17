"use client";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { BeatmapStatus } from "@/lib/hooks/api/beatmap/types";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { Score } from "@/lib/hooks/api/score/types";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";
import { timeSince } from "@/lib/utils/timeSince";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface UserScoreOverviewProps {
  score: Score;
  className?: string;
}

export default function UserScoreOverview({
  score,
  className,
}: UserScoreOverviewProps) {
  const router = useRouter();

  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;

  return (
    <div
      className={twMerge("text-gray-100 rounded-lg", className)}
      onClick={() => router.push(`/score/${score.id}`)}
    >
      <div className="h-20 relative">
        <div className="z-20 p-4 bg-gradient-to-l from-accent to-transparent place-content-between flex items-center h-full cursor-pointer">
          <div className="z-20 flex-row overflow-hidden flex-wrap">
            <div className="flex font-bold text-sm md:text-xl drop-shadow-md items-center ">
              <span className="pr-1">
                <BeatmapStatusIcon
                  status={beatmap?.status ?? BeatmapStatus.Graveyard}
                />
              </span>
              {beatmap?.artist && beatmap?.title ? (
                <span className="line-clamp-2">
                  {beatmap.artist + " - " + beatmap?.title}
                </span>
              ) : (
                <div className="flex items-center">
                  <Skeleton className="w-28 h-3" />
                  &nbsp;-&nbsp;
                  <Skeleton className="w-20 h-3" />
                </div>
              )}
            </div>
            <div className="flex items-end space-x-3">
              <div className="text-base drop-shadow-md text-gray-100 line-clamp-1">
                {beatmap?.version ?? <Skeleton className="w-24 h-4" />}
              </div>
              <div className="text-sm drop-shadow-md text-gray-300 italic line-clamp-1 sm:line-clamp-none">
                {timeSince(score.when_played) ?? (
                  <Skeleton className="w-24 h-4" />
                )}
              </div>
            </div>
          </div>

          <div className="z-20 hidden items-center space-x-4 md:flex">
            <div className="text-end text-nowrap">
              <p className="text-sm opacity-70">{score.mods}</p>
              <p className="text-xl text-primary">
                {beatmap && isBeatmapRanked(beatmap)
                  ? score.performance_points.toFixed()
                  : "- "}
                pp
              </p>
              <p className="text-sm">acc: {score.accuracy.toFixed(2)}%</p>
            </div>
            <div
              className={`relative px-1 text-4xl text-${getGradeColor(
                score.grade
              )}`}
            >
              {score.grade}
            </div>
          </div>
        </div>

        <>
          <div className="absolute inset-0 overflow-hidden rounded-t-lg md:rounded-lg">
            <ImageWithFallback
              src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
              alt="user bg"
              fill={true}
              objectFit="cover"
              className="relativ opacity-50"
              fallBackSrc="/images/unknown-beatmap-banner.jpg"
            />
          </div>
          <div className="z-10 absolute inset-0 bg-gradient-to-r from-card to-transparent md:to-primary/20 via-card/70 md:via-card/50 rounded-t-lg md:rounded-lg" />
        </>
      </div>

      <RoundedContent className="bg-card h-20 flex place-content-between mx-auto md:hidden ">
        <div className="items-center space-x-4 flex">
          <div className="text-start text-nowrap">
            <p className="text-sm opacity-70">{score.mods}</p>
            <p className="text-xl text-primary">
              {beatmap && isBeatmapRanked(beatmap)
                ? score.performance_points.toFixed()
                : "- "}
              pp
            </p>

            <p className="text-sm ">acc: {score.accuracy.toFixed(2)}%</p>
          </div>
        </div>
        <div className={`relative text-5xl text-${getGradeColor(score.grade)}`}>
          {score.grade}
        </div>
      </RoundedContent>
    </div>
  );
}
