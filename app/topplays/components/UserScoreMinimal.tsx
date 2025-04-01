"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import SkeletonLoading from "@/components/SkeletonLoading";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { Score } from "@/lib/hooks/api/score/types";
import { useUser } from "@/lib/hooks/api/user/useUser";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface UserScoreMinimalProps {
  score: Score;
  className?: string;
}

export default function UserScoreMinimal({
  score,
  className,
}: UserScoreMinimalProps) {
  const userQuery = useUser(score.user_id);
  const beatmapQuery = useBeatmap(score.beatmap_id);

  const user = userQuery.data;
  const beatmap = beatmapQuery.data;

  return (
    <div
      className={twMerge(
        "bg-terracotta-700 rounded-lg overflow-hidden",
        className
      )}
      onClick={() => (window.location.href = `/score/${score.id}`)}
    >
      <div className="h-28 relative">
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
          <div className="py-2 px-4 flex place-content-between bg-black hover:bg-opacity-40 bg-opacity-50 w-full h-full smooth-transition ">
            <div className="flex-col h-full flex justify-between overflow-hidden ">
              <div className="flex-col overflow-hidden flex-wrap">
                <h1 className="font-bold text-sm drop-shadow-md flex text-ellipsis">
                  {beatmap?.artist ?? <SkeletonLoading className="w-20 h-3" />}
                  &nbsp;-&nbsp;
                  {beatmap?.title ?? <SkeletonLoading className="w-28 h-3" />}
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs drop-shadow-md text-gray-100 ">
                    {beatmap?.version ?? (
                      <SkeletonLoading className="w-16 h-3" />
                    )}
                  </p>
                </div>
              </div>
              <div className="flex pb-1">
                <div className="rounded-md overflow-hidden border-2 border-white mr-2">
                  {user?.user_id ? (
                    <Image
                      src={`https://a.${
                        process.env.NEXT_PUBLIC_SERVER_DOMAIN
                      }/avatar/${user?.user_id}?${Date.now()}`}
                      alt=""
                      objectFit="cover"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <SkeletonLoading className="w-4 h-4" />
                  )}
                </div>

                <h2 className="text-white text-md font-bold mr-2 overflow-hidden flex-wrap whitespace-nowrap">
                  {user?.username ?? <SkeletonLoading className="w-24 h-4" />}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-end text-nowrap">
                <p className="text-md opacity-70">{score.mods}</p>
                <p className="text-2xl text-terracotta-300">
                  {beatmap && isBeatmapRanked(beatmap)
                    ? score.performance_points.toFixed()
                    : "- "}
                  pp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
