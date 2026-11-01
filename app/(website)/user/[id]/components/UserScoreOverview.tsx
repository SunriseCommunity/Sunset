"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useT } from "@/lib/i18n/utils";
import type { ScoreResponse } from "@/lib/types/api";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { timeSince } from "@/lib/utils/timeSince";

interface UserScoreOverviewProps {
  score: ScoreResponse;
  className?: string;
}

export default function UserScoreOverview({
  score,
  className,
}: UserScoreOverviewProps) {
  const t = useT("pages.user.components.scoreOverview");
  const beatmapQuery = useBeatmap(score.beatmap_id);
  const beatmap = beatmapQuery.data;
  const isPerfectScore = score.grade === "X" || score.grade === "XH";

  return (
    <div
      className={twMerge(
        "text-gray-100 rounded-lg hover:scale-105 smooth-transition shadow",
        className,
      )}
    >
      <div className="relative z-20 h-20 ">
        <Link href={`/score/${score.id}`}>
          <div className="flex h-full cursor-pointer place-content-between items-center rounded-t-lg bg-black bg-opacity-60 p-4 hover:bg-opacity-50 md:rounded-lg">
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden pr-2">
              <div className="flex min-w-0 items-center text-sm font-bold drop-shadow-md md:text-xl">
                <span className="shrink-0 pr-1">
                  <BeatmapStatusIcon
                    status={beatmap?.status ?? BeatmapStatusWeb.GRAVEYARD}
                  />
                </span>
                {beatmap?.artist && beatmap?.title ? (
                  <span className="line-clamp-2 min-w-0 flex-1">
                    {`${beatmap.artist} - ${beatmap?.title}`}
                  </span>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                )}
                <ModsBadges mods={score.mods} />
              </div>
              <div className="flex items-center space-x-3">
                <div className="line-clamp-1 text-base text-gray-100 drop-shadow-md">
                  {beatmap?.version ?? <Skeleton className="h-4 w-24" />}
                </div>
                <div className="line-clamp-1 text-sm italic text-gray-300 drop-shadow-md">
                  {timeSince(score.when_played) ?? (
                    <Skeleton className="h-4 w-24" />
                  )}
                </div>
              </div>
            </div>

            <div className="z-20 hidden items-center space-x-4 md:flex">
              <div className="text-nowrap text-end">
                <p className="text-xl text-primary">
                  {beatmap && beatmap.is_ranked
                    ? score.performance_points.toFixed(0)
                    : "- "}
                  {" "}
                  {t("pp")}
                </p>
                <p className={twMerge("text-sm", isPerfectScore && "text-primary")}>
                  {t("accuracy", { accuracy: score.accuracy.toFixed(2) })}
                </p>
              </div>
              <div
                className={`text-${getGradeColor(
                  score.grade,
                )} relative px-1 text-4xl`}
              >
                {score.grade}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 -z-10 overflow-hidden rounded-t-lg md:rounded-lg">
            <ImageWithFallback
              src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
              alt="beatmap image"
              fill={true}
              objectFit="cover"
              className="relative"
              fallBackSrc="/images/unknown-beatmap-banner.jpg"
            />
          </div>
        </Link>
      </div>

      <RoundedContent className="mx-auto flex h-20 place-content-between bg-card md:hidden ">
        <div className="flex items-center space-x-4">
          <div className="text-nowrap text-start">
            <p className="text-xl text-primary">
              {beatmap && beatmap.is_ranked
                ? score.performance_points.toFixed(0)
                : "- "}
              {" "}
              {t("pp")}
            </p>

            <p className={twMerge("text-sm text-muted-foreground", isPerfectScore && "text-primary")}>
              {t("accuracy", { accuracy: score.accuracy.toFixed(2) })}
            </p>
          </div>
        </div>
        <div className={`text-${getGradeColor(score.grade)} relative text-5xl`}>
          {score.grade}
        </div>
      </RoundedContent>
    </div>
  );
}

function ModsBadges({ mods }: { mods?: string | null }) {
  const modList = (mods ?? "")
    .split(",")
    .map(mod => mod.trim())
    .filter(Boolean);

  if (modList.length === 0)
    return null;

  return (
    <span className="ml-2 flex flex-wrap items-center gap-1">
      {modList.map(mod => (
        <span
          key={mod}
          className="rounded bg-yellow-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-yellow-300 md:text-xs"
        >
          {mod}
        </span>
      ))}
    </span>
  );
}
