"use client";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { PlayIcon } from "lucide-react";
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
      onClick={() =>
        (window.location.href = `/beatmapsets/${beatmap.beatmapset_id}/${beatmap.id}`)
      }
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
          <Skeleton className="" />
        )}

        <div className="absolute inset-0 bg-gradient-to-l from-terracotta-200 to-transparent flex items-center cursor-pointer">
          <div className="p-6 flex place-content-between bg-black hover:bg-opacity-40 bg-opacity-50 w-full  smooth-transition items-center">
            <div className="flex-row overflow-hidden flex-wrap">
              <h1 className="text-xl drop-shadow-md flex items-center ">
                <span className="pr-1">
                  <BeatmapStatusIcon status={beatmap.status} />
                </span>
                <p className="text-ellipsis text-nowrap overflow-clip max-w-full">
                  {beatmap?.artist ?? <Skeleton className="w-20 h-3" />}
                  &nbsp;-&nbsp;
                  {beatmap?.title ?? <Skeleton className="w-28 h-3" />}
                </p>
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-base drop-shadow-md text-gray-100 ">
                  {beatmap?.version ?? <Skeleton className="w-16 h-3" />}
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
