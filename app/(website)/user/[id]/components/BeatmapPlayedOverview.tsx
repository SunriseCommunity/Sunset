"use client";

import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import type { BeatmapResponse } from "@/lib/types/api";
import { BeatmapStatusWeb } from "@/lib/types/api";

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
        className,
      )}
    >
      <div className="relative h-20 ">
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

          <div className="absolute inset-0 flex cursor-pointer items-center bg-black bg-opacity-60 hover:bg-opacity-50">
            <div className="smooth-transition flex w-full  place-content-between items-center p-6">
              <div className="flex-row flex-wrap overflow-hidden">
                <div className="flex items-center text-sm font-bold drop-shadow-md md:text-xl ">
                  <span className="pr-1">
                    <BeatmapStatusIcon
                      status={beatmap?.status ?? BeatmapStatusWeb.GRAVEYARD}
                    />
                  </span>
                  {beatmap?.artist && beatmap?.title ? (
                    <span className="line-clamp-2">
                      {`${beatmap.artist} - ${beatmap?.title}`}
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <Skeleton className="h-3 w-28" />
                      &nbsp;-&nbsp;
                      <Skeleton className="h-3 w-20" />
                    </div>
                  )}
                </div>
                <div className="flex items-end space-x-3">
                  <div className="line-clamp-1 text-base text-gray-100 drop-shadow-md">
                    {beatmap?.version ?? <Skeleton className="h-4 w-24" />}
                  </div>
                </div>
              </div>

              <div className="flex min-w-12 items-center space-x-4">
                <div className="flex items-center space-x-2 text-nowrap text-start">
                  <PlayIcon size={24} className="fill-white text-white" />
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
