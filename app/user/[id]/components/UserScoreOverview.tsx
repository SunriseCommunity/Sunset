"use client";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import ImageWithFallback from "@/components/ImageWithFallback";
import SkeletonLoading from "@/components/SkeletonLoading";
import { getBeatmap } from "@/lib/actions/getBeatmap";
import { Beatmap, BeatmapStatus } from "@/lib/hooks/api/beatmap/types";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { Score } from "@/lib/hooks/api/score/types";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";
import { timeSince } from "@/lib/utils/timeSince";
import { twMerge } from "tailwind-merge";

interface UserScoreOverviewProps {
  score: Score;
  className?: string;
}

export default function UserScoreOverview({
  score,
  className,
}: UserScoreOverviewProps) {
  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;

  console.log(beatmapQuery);

  return (
    <div
      className={twMerge(
        "bg-terracotta-700 rounded-lg overflow-hidden",
        className
      )}
      onClick={() => window.open("/score/" + score.id)}
    >
      <div className="h-20 relative">
        {beatmap?.beatmapset_id ? (
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
            alt=""
            fill={true}
            objectFit="cover"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />
        ) : (
          <SkeletonLoading className="" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-terracotta-200 to-transparent flex items-center cursor-pointer">
          <div className="p-6 flex place-content-between bg-black hover:bg-opacity-40 bg-opacity-50 w-full  smooth-transition items-center">
            <div className="flex-row overflow-hidden flex-wrap">
              <h1 className="text-xl drop-shadow-md flex items-center ">
                <span className="pr-1">
                  <BeatmapStatusIcon
                    status={beatmap?.status ?? BeatmapStatus.Graveyard}
                  />
                </span>
                <p className="text-ellipsis text-nowrap overflow-clip max-w-full">
                  {beatmap?.artist ?? <SkeletonLoading className="w-20 h-3" />}
                  &nbsp;-&nbsp;
                  {beatmap?.title ?? <SkeletonLoading className="w-28 h-3" />}
                </p>
              </h1>
              <div className="flex items-end space-x-3">
                <p className="text-base drop-shadow-md text-gray-100">
                  {beatmap?.version ?? <SkeletonLoading className="w-24 h-4" />}
                </p>
                <p className="text-sm drop-shadow-md text-gray-300 italic">
                  {timeSince(score.when_played) ?? (
                    <SkeletonLoading className="w-24 h-4" />
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-end text-nowrap">
                <p className="text-sm opacity-70">{score.mods}</p>
                <p className="text-xl text-terracotta-300">
                  {beatmap && isBeatmapRanked(beatmap)
                    ? score.performance_points.toFixed()
                    : "- "}
                  pp
                </p>
                <p className="text-sm ">acc: {score.accuracy.toFixed(2)}%</p>
              </div>
              <div
                className={`relative text-4xl text-${getGradeColor(
                  score.grade
                )}`}
              >
                {score.grade}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
