"use client";

import SkeletonLoading from "@/components/SkeletonLoading";
import { getBeatmap } from "@/lib/actions/getBeatmap";
import { Beatmap } from "@/lib/types/Beatmap";
import { Score } from "@/lib/types/Score";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { timeSince } from "@/lib/utils/timeSince";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface UserScoreOverviewProps {
  score: Score;
  className?: string;
}

export default function UserScoreOverview({
  score,
  className,
}: UserScoreOverviewProps) {
  const [beatmap, setBeatmap] = useState<Beatmap | null>(null);

  useEffect(() => {
    getBeatmap(score.beatmap_id).then((res) => {
      if (res.error) return;
      setBeatmap(res.data);
    });
  }, [score]);

  return (
    <div
      className={twMerge(
        "bg-terracotta-700 rounded-lg overflow-hidden",
        className
      )}
      onClick={() => window.open("/score/" + score.id)}
    >
      <div className="h-20 relative">
        <Image
          src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
          alt=""
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-terracotta-200 to-transparent flex items-center cursor-pointer">
          <div className="p-6 flex place-content-between bg-black hover:bg-opacity-40 bg-opacity-50 w-full  smooth-transition items-center">
            <div className="">
              <h1 className="text-xl font-bold drop-shadow-md flex items-center">
                {beatmap?.artist ?? <SkeletonLoading className="w-32 h-4" />}
                &nbsp;-&nbsp;
                {beatmap?.title ?? <SkeletonLoading className="w-48 h-4" />}
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-base drop-shadow-md text-gray-100 ">
                  {beatmap?.version ?? <SkeletonLoading className="w-24 h-4" />}
                </p>
                <p className="text-base drop-shadow-md text-gray-200">
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
                  {beatmap?.ranked == 1
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
