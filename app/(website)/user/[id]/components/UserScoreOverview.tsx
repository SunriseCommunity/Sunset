"use client";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { BeatmapStatusSearch, ScoreResponse } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { timeSince } from "@/lib/utils/timeSince";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface UserScoreOverviewProps {
  score: ScoreResponse;
  className?: string;
}

export default function UserScoreOverview({
  score,
  className,
}: UserScoreOverviewProps) {
  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;

  return (
    <div
      className={twMerge(
        "text-gray-100 rounded-lg hover:scale-105 smooth-transition shadow",
        className
      )}
    >
      <div className="z-20 h-20 relative ">
        <Link href={`/score/${score.id}`}>
          <div className="bg-black hover:bg-opacity-50 bg-opacity-60 p-4 rounded-t-lg md:rounded-lg place-content-between flex items-center h-full cursor-pointer">
            <div className="flex-row overflow-hidden flex-wrap">
              <div className="flex font-bold text-sm md:text-xl drop-shadow-md items-center ">
                <span className="pr-1">
                  <BeatmapStatusIcon
                    status={beatmap?.status ?? BeatmapStatusSearch.GRAVEYARD}
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
              <div className="flex items-center space-x-3">
                <div className="text-base drop-shadow-md text-gray-100 line-clamp-1">
                  {beatmap?.version ?? <Skeleton className="w-24 h-4" />}
                </div>
                <div className="text-sm drop-shadow-md text-gray-300 italic line-clamp-1">
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
                  {beatmap && beatmap.is_ranked
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

          <div className="-z-10 absolute inset-0 overflow-hidden rounded-t-lg md:rounded-lg">
            <ImageWithFallback
              src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
              alt="beatmap image"
              fill={true}
              objectFit="cover"
              className="relative"
              fallBackSrc="/images/unknown-beatmap-banner.jpg"
            />
          </div>
        </Link>
      </div>

      <RoundedContent className="bg-card h-20 flex place-content-between mx-auto md:hidden ">
        <div className="items-center space-x-4 flex">
          <div className="text-start text-nowrap">
            <p className="text-sm opacity-70 text-muted-foreground">
              {score.mods}
            </p>
            <p className="text-xl text-primary">
              {beatmap && beatmap.is_ranked
                ? score.performance_points.toFixed()
                : "- "}
              pp
            </p>

            <p className="text-sm text-muted-foreground">
              acc: {score.accuracy.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className={`relative text-5xl text-${getGradeColor(score.grade)}`}>
          {score.grade}
        </div>
      </RoundedContent>
    </div>
  );
}
