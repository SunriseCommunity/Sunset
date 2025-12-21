"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import PrettyDate from "@/components/General/PrettyDate";
import { twMerge } from "tailwind-merge";
import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import ImageWithFallback from "@/components/ImageWithFallback";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { BeatmapSetResponse } from "@/lib/types/api";
import { CircularProgress } from "@/components/ui/circular-progress";
import { CollapsibleBadgeList } from "@/components/CollapsibleBadgeList";
import BeatmapDifficultyBadge from "@/components/BeatmapDifficultyBadge";
import { useT } from "@/lib/i18n/utils";
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
      className="relative flex h-24 bg-background  rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
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
            "absolute inset-0  flex items-center justify-center z-30 smooth-transition",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          <AudioPreview beatmapSet={beatmapSet} />
        </div>

        <div
          className={twMerge(
            "absolute inset-0 bg-terracotta-800 bg-opacity-50 flex items-center justify-center z-20 smooth-transition",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          <CircularProgress
            value={currentTimestamp * 10}
            strokeWidth={4}
            className="hidden"
            progressClassName={twMerge(
              "relative",
              !isPlayingThis ? "hidden" : undefined
            )}
          />
        </div>
      </div>

      <div className="flex-col flex overflow-hidden z-10 w-full bg-gradient-to-r from-black/70 to-transparent justify-between h-24">
        <div
          className={twMerge(
            "bg-black px-3 py-1 z-20 w-full h-full smooth-transition",
            isHovered ? " bg-opacity-70" : " bg-opacity-50"
          )}
        >
          <Link href={`/beatmapsets/${beatmapSet.id}`}>
            <div>
              <div className="flex items-center">
                <span className="-ml-1 mr-1">
                  <BeatmapStatusIcon status={beatmapSet.status} />
                </span>
                <h3 className="text-base font-semibold text-white truncate">
                  {beatmapSet.title}
                </h3>
              </div>
              <p className="text-xs text-gray-200 truncate">
                {t("by", { artist: beatmapSet.artist })}
              </p>
              <p className="text-[10px] text-gray-300 truncate">
                {t("mappedBy", { creator: beatmapSet.creator })}
              </p>
            </div>
          </Link>
          <div className="flex-col flex">
            <div
              className={twMerge(
                "flex items-center smooth-transition text-gray-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <Calendar className="w-[11px] h-[11px] mr-1" />
              <PrettyDate
                time={beatmapSet.submitted_date}
                className="font-bold text-[10px]"
              />
            </div>

            <div className="flex flex-row overflow-hidden h-5 flex-wrap -ml-0.5 space-x-0.5  rounded-lg w-fit">
              <CollapsibleBadgeList
                maxVisible={11}
                disableButton
                className="gap-0.5"
                badges={beatmapSet.beatmaps
                  .sort(
                    (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b)
                  )
                  .sort((a, b) => a.mode_int - b.mode_int)
                  .map((beatmap, i) => (
                    <BeatmapDifficultyBadge
                      key={i}
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
