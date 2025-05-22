"use client";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { BeatmapResponse, BeatmapStatusWeb } from "@/lib/types/api";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface BeatmapPlayedOverviewProps {
  beatmap: BeatmapResponse;
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
        "bg-card rounded-lg overflow-hidden text-white hover:scale-105 smooth-transition shadow",
        className
      )}
    >
      <div className="h-20 relative ">
        <Link href={`/beatmapsets/${beatmap.beatmapset_id}/${beatmap.id}`}>
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

          <div className="absolute inset-0 bg-black hover:bg-opacity-50 bg-opacity-60 flex items-center cursor-pointer">
            <div className="p-6 flex place-content-between  w-full smooth-transition items-center">
              <div className="flex-row overflow-hidden flex-wrap">
                <div className="flex font-bold text-sm md:text-xl drop-shadow-md items-center ">
                  <span className="pr-1">
                    <BeatmapStatusIcon
                      status={beatmap?.status ?? BeatmapStatusWeb.GRAVEYARD}
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
        </Link>
      </div>
    </div>
  );
}
