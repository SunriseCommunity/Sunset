"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import BeatmapDifficultyBadge from "@/components/BeatmapDifficultyBadge";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import { CollapsibleBadgeList } from "@/components/CollapsibleBadgeList";
import PrettyDate from "@/components/General/PrettyDate";
import ImageWithFallback from "@/components/ImageWithFallback";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Skeleton } from "@/components/ui/skeleton";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface BeatmapSetOverviewProps {
  beatmapSet: BeatmapSetResponse;
}

export default function BeatmapSetOverview({
  beatmapSet,
}: BeatmapSetOverviewProps) {
  const t = useT("pages.user.components.beatmapSetOverview");
  const [isHovered, setIsHovered] = useState(false);

  const { player, isPlaying, currentTimestamp } = useAudioPlayer();

  const isPlayingThis = player.current?.src.includes(`${beatmapSet.id}.mp3`);

  return (
    <div
      className="relative flex h-24 overflow-hidden  rounded-lg bg-background transition-all duration-300 ease-in-out"
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

      <div className="relative z-20 size-24 flex-shrink-0">
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
            "absolute inset-0  flex items-center justify-center z-30 smooth-transition",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0",
          )}
        >
          <AudioPreview beatmapSet={beatmapSet} />
        </div>

        <div
          className={twMerge(
            "absolute inset-0 bg-terracotta-800 bg-opacity-50 flex items-center justify-center z-20 smooth-transition",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0",
          )}
        >
          <CircularProgress
            value={currentTimestamp * 10}
            strokeWidth={4}
            className="hidden"
            progressClassName={twMerge(
              "relative",
              !isPlayingThis ? "hidden" : undefined,
            )}
          />
        </div>
      </div>

      <div className="z-10 flex h-24 w-full flex-col justify-between overflow-hidden bg-gradient-to-r from-black/70 to-transparent">
        <div
          className={twMerge(
            "bg-black px-3 py-1 z-20 w-full h-full smooth-transition",
            isHovered ? " bg-opacity-70" : " bg-opacity-50",
          )}
        >
          <Link href={`/beatmapsets/${beatmapSet.id}`}>
            <div>
              <div className="flex items-center">
                <span className="-ml-1 mr-1">
                  <BeatmapStatusIcon status={beatmapSet.status} />
                </span>
                <h3 className="truncate text-base font-semibold text-white">
                  {beatmapSet.title}
                </h3>
              </div>
              <p className="truncate text-xs text-gray-200">
                {t("by", { artist: beatmapSet.artist })}
              </p>
              <p className="truncate text-[10px] text-gray-300">
                {t("mappedBy", { creator: beatmapSet.creator })}
              </p>
            </div>
          </Link>
          <div className="flex flex-col">
            <div
              className={twMerge(
                "flex items-center smooth-transition text-gray-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              <Calendar className="mr-1 h-[11px] w-[11px]" />
              <PrettyDate
                time={beatmapSet.submitted_date}
                className="text-[10px] font-bold"
              />
            </div>

            <div className="-ml-0.5 flex h-5 w-fit flex-row flex-wrap space-x-0.5  overflow-hidden rounded-lg">
              <CollapsibleBadgeList
                maxVisible={11}
                disableButton
                className="gap-0.5"
                badges={beatmapSet.beatmaps
                  .sort(
                    (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b),
                  )
                  .sort((a, b) => a.mode_int - b.mode_int)
                  .map(beatmap => (
                    <BeatmapDifficultyBadge
                      key={`beatmap-difficulty-badge-${beatmap.id}`}
                      beatmap={beatmap}
                      iconPreview
                    />
                  ))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
