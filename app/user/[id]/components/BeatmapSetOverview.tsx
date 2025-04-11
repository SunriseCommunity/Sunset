"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import Image from "next/image";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import DifficultyIcon from "@/components/DifficultyIcon";
import PrettyDate from "@/components/General/PrettyDate";
import { twMerge } from "tailwind-merge";
import AudioPreview from "@/app/user/[id]/components/AudioPreview";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import ImageWithFallback from "@/components/ImageWithFallback";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { Skeleton } from "@/components/ui/skeleton";
interface BeatmapSetOverviewProps {
  beatmapSet: BeatmapSet;
}

export default function BeatmapSetOverview({
  beatmapSet,
}: BeatmapSetOverviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { player, isPlaying } = useAudioPlayer();

  const isPlayingThis = player.current?.src.includes(`${beatmapSet.id}.mp3`);

  return (
    <div
      className="relative flex h-24 bg-terracotta-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {beatmapSet.id ? (
        <ImageWithFallback
          src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover.jpg`}
          alt=""
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          fallBackSrc="/images/unknown-beatmap-banner.jpg"
        />
      ) : (
        <Skeleton className="" />
      )}

      <div
        className="absolute inset-0 cursor-pointer z-20"
        onClick={() => (window.location.href = `/beatmapsets/${beatmapSet.id}`)}
      />

      <div className="relative w-24 h-24 flex-shrink-0 z-20">
        {beatmapSet.id ? (
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
            alt={`${beatmapSet.title} cover`}
            className=""
            layout="fill"
            objectFit="cover"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />
        ) : (
          <Skeleton className="" />
        )}

        <div
          className={twMerge(
            "absolute inset-0 bg-terracotta-800 bg-opacity-50 flex items-center justify-center z-20 smooth-transition",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          <AudioPreview beatmapSet={beatmapSet} />
        </div>
      </div>

      <div className="flex-col flex overflow-hidden z-10 w-full bg-gradient-to-r from-terracotta-500  to-transparent justify-between h-24">
        <div
          className={twMerge(
            "bg-black px-3 py-1 z-20 w-full h-full smooth-transition",
            isHovered ? " bg-opacity-70" : " bg-opacity-50"
          )}
        >
          <div>
            <div className="flex items-center">
              <span className="-ml-1">
                <BeatmapStatusIcon status={beatmapSet.status} />
              </span>
              <h3 className="text-base font-semibold text-white truncate">
                {beatmapSet.title}
              </h3>
            </div>
            <p className="text-xs text-gray-200 truncate">
              by {beatmapSet.artist}
            </p>
            <p className="text-[10px] text-gray-300 truncate">
              mapped by {beatmapSet.creator}
            </p>
          </div>

          <div className="flex-col flex -mb-1.5">
            <div
              className={twMerge(
                "flex items-center smooth-transition",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <Calendar className="w-[11px] h-[11px] mr-1" />
              <PrettyDate
                time={beatmapSet.submitted_date}
                className="font-bold text-[10px] text-gray-30"
              />
            </div>

            <div className="flex flex-row overflow-hidden h-5 flex-wrap mb-1 -ml-0.5 space-x-0.5">
              {beatmapSet.beatmaps
                .sort(
                  (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b)
                )
                .sort((a, b) => a.mode_int - b.mode_int)
                .map((difficulty) => (
                  <div
                    className="bg-terracotta-800 rounded-full bg-opacity-80 p-0.5"
                    key={difficulty.id}
                  >
                    <DifficultyIcon difficulty={difficulty} className="h-4" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
