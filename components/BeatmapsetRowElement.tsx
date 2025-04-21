import { twMerge } from "tailwind-merge";

import Image from "next/image";
import ImageWithFallback from "./ImageWithFallback";
import { User } from "@/lib/hooks/api/user/types";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import Link from "next/link";
import DifficultyIcon from "@/components/DifficultyIcon";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import BeatmapStatusIcon from "@/components/BeatmapStatus";

interface UserProfileBannerProps {
  beatmapSet: BeatmapSet;
  className?: string;
}

export default function BeatmapsetRowElement({
  beatmapSet,
  className,
}: UserProfileBannerProps) {
  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden rounded-lg group h-16",
        className
      )}
    >
      <Link href={`/beatmapsets/${beatmapSet.id}`}>
        <div className="relative h-full place-content-between flex-col flex group-hover:cursor-pointer smooth-transition">
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
            alt=""
            fill={true}
            objectFit="cover"
            className="bg-stone-700 rounded-t-lg"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />

          <div className="absolute inset-0 bg-black bg-opacity-70 group-hover:bg-opacity-50 smooth-transition" />

          <div className="relative flex items-center">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
              <ImageWithFallback
                src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
                alt=""
                width={256}
                height={256}
                className="w-full h-16 object-cover"
                fallBackSrc="/images/unknown-beatmap-banner.jpg"
              />
            </div>

            <div className="flex flex-col w-9/12">
              <div>
                <div className="flex items-center">
                  <span className="-ml-1 mr-1">
                    <BeatmapStatusIcon status={beatmapSet.status} />
                  </span>
                  <div className="line-clamp-1 flex">
                    <h3 className="text-base font-semibold text-white truncate">
                      {beatmapSet.artist} - {beatmapSet.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[10px] text-gray-300 truncate">
                  mapped by {beatmapSet.creator}
                </p>
              </div>

              <div className="flex  flex-row overflow-hidden h-5 flex-wrap -ml-0.5 space-x-0.5 bg-terracotta-800 bg-opacity-50 rounded-lg w-fit">
                {beatmapSet.beatmaps
                  .sort(
                    (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b)
                  )
                  .sort((a, b) => a.mode_int - b.mode_int)
                  .map((difficulty) => (
                    <div className="py-1 px-0.5" key={difficulty.id}>
                      <DifficultyIcon
                        difficulty={difficulty}
                        className="text-sm rounded-full"
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
