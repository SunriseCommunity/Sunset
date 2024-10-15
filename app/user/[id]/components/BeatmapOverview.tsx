"use client";

import SkeletonLoading from "@/components/SkeletonLoading";
import { getBeatmap } from "@/lib/actions/getBeatmap";
import { getUser } from "@/lib/actions/getUser";
import { Beatmap } from "@/lib/types/Beatmap";
import { Score } from "@/lib/types/Score";
import { User } from "@/lib/types/User";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface BeatmapPlayedOverviewProps {
  beatmap: Beatmap;
  playcount: number;
  className?: string;
}

export default function BeatmapPlayedOverview({
  beatmap,
  playcount,
  className,
}: BeatmapPlayedOverviewProps) {
  return (
    <div
      className={twMerge(
        "bg-terracotta-700 rounded-lg overflow-hidden",
        className
      )}
      onClick={() => (window.location.href = `/beatmap/${beatmap.id}`)}
    >
      <div className="h-20 relative">
        <Image
          src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
          alt=""
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-terracotta-200 to-transparent flex items-center cursor-pointer">
          <div className="py-2 px-4 flex place-content-between bg-black hover:bg-opacity-40 bg-opacity-50 w-full h-full smooth-transition ">
            <div>
              <h1 className="text-xl drop-shadow-md flex items-center">
                {beatmap?.artist ?? <SkeletonLoading className="w-20 h-3" />}
                &nbsp;-&nbsp;
                {beatmap?.title ?? <SkeletonLoading className="w-28 h-3" />}
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-base drop-shadow-md text-gray-100 ">
                  {beatmap?.version ?? <SkeletonLoading className="w-16 h-3" />}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 min-w-12">
              <div className="text-start text-nowrap flex items-center space-x-2">
                <PlayIcon size={24} className="text-white fill-white" />
                <p className="text-2xl text-white">{playcount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
