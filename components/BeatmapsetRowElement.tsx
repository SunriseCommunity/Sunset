import Link from "next/link";
import { twMerge } from "tailwind-merge";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import DifficultyIcon from "@/components/DifficultyIcon";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

import ImageWithFallback from "./ImageWithFallback";

interface UserProfileBannerProps {
  beatmapSet: BeatmapSetResponse;
  className?: string;
}

export default function BeatmapsetRowElement({
  beatmapSet,
  className,
}: UserProfileBannerProps) {
  const t = useT("components.beatmapsetRowElement");
  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden rounded-lg group h-16",
        className,
      )}
    >
      <Link href={`/beatmapsets/${beatmapSet.id}`}>
        <div className="smooth-transition relative flex h-full flex-col place-content-between group-hover:cursor-pointer">
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
            alt=""
            fill={true}
            objectFit="cover"
            className="rounded-t-lg bg-stone-700"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />

          <div className="smooth-transition absolute inset-0 bg-black bg-opacity-70 group-hover:bg-opacity-50" />

          <div className="relative flex items-center">
            <div className="relative mr-4 size-16 overflow-hidden rounded-lg">
              <ImageWithFallback
                src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
                alt=""
                fill={true}
                objectFit="cover"
                fallBackSrc="/images/unknown-beatmap-banner.jpg"
              />
            </div>

            <div className="flex w-9/12 flex-col">
              <div>
                <div className="flex items-center">
                  <span className="-ml-1 mr-1">
                    <BeatmapStatusIcon status={beatmapSet.status} />
                  </span>
                  <div className="line-clamp-1 flex">
                    <h3 className="truncate text-base font-semibold text-white">
                      {beatmapSet.artist} - {beatmapSet.title}
                    </h3>
                  </div>
                </div>
                <p className="truncate text-[10px] text-gray-300">
                  {t("mappedBy", { creator: beatmapSet.creator })}
                </p>
              </div>

              <div className="-ml-0.5  flex h-5 w-fit flex-row flex-wrap space-x-0.5 overflow-hidden rounded-lg bg-terracotta-800 bg-opacity-50">
                {beatmapSet.beatmaps
                  .sort(
                    (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b),
                  )
                  .sort((a, b) => a.mode_int - b.mode_int)
                  .map(difficulty => (
                    <div className="px-0.5 py-1" key={difficulty.id}>
                      <DifficultyIcon
                        difficulty={difficulty}
                        className="rounded-full text-sm"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
