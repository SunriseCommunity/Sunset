"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

import ImageWithFallback from "@/components/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import UserHoverCard from "@/components/UserHoverCard";
import UserRankColor from "@/components/UserRankNumber";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useUserStats } from "@/lib/hooks/api/user/useUser";
import { useT } from "@/lib/i18n/utils";
import type { ScoreResponse } from "@/lib/types/api";

interface UserScoreMinimalProps {
  score: ScoreResponse;
  showUser?: boolean;
  className?: string;
}

export default function UserScoreMinimal({
  score,
  showUser = true,
  className,
}: UserScoreMinimalProps) {
  const t = useT("pages.topplays.components.userScoreMinimal");
  const userStatsQuery = useUserStats(score.user_id, score.game_mode_extended);
  const beatmapQuery = useBeatmap(score.beatmap_id);

  const user = userStatsQuery.data?.user;
  const userStats = userStatsQuery.data?.stats;
  const beatmap = beatmapQuery.data;

  return (
    <div
      className={twMerge(
        "bg-card rounded-lg overflow-hidden text-white shadow",
        className,
      )}
    >
      <div className="relative h-28">
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
        <Link href={`/score/${score.id}`}>
          <div className="smooth-transition absolute inset-0 flex cursor-pointer items-center bg-black bg-opacity-60 hover:bg-opacity-50">
            <div className="flex size-full place-content-between px-4 py-2">
              <div className="flex h-full flex-col justify-between overflow-hidden ">
                <div className="flex-col">
                  <div className="line-clamp-2 items-center text-sm font-bold drop-shadow-md">
                    {beatmap?.artist && beatmap?.title ? (
                      `${beatmap.artist} - ${beatmap?.title}`
                    ) : (
                      <div className="flex items-center">
                        <Skeleton className="h-3 w-28" />
                        &nbsp;-&nbsp;
                        <Skeleton className="h-3 w-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {beatmap?.version ? (
                      <div className="line-clamp-1">
                        <p className="truncate text-xs text-gray-100 drop-shadow-md">
                          {beatmap?.version}
                        </p>
                      </div>
                    ) : (
                      <Skeleton className="h-3 w-16" />
                    )}
                  </div>
                </div>

                {showUser && (
                  <div className="flex">
                    <div className="flex min-w-0 flex-grow items-center">
                      <Avatar className="size-8 border-2">
                        <Suspense
                          fallback={(
                            <AvatarFallback>
                              <Skeleton className="size-4" />
                            </AvatarFallback>
                          )}
                        >
                          {user && (
                            <Image
                              src={user?.avatar_url ?? ""}
                              width={64}
                              height={64}
                              alt="Avatar"
                            />
                          )}
                        </Suspense>
                      </Avatar>

                      <div className="mx-1 line-clamp-1">
                        {user ? (
                          <UserHoverCard user={user} asChild>
                            <UserRankColor
                              rank={userStats?.rank ?? -1}
                              variant="primary"
                              className="truncate"
                            >
                              {user.username}
                            </UserRankColor>
                          </UserHoverCard>
                        ) : (
                          <Skeleton className="h-3 w-20" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mx-2 flex items-center space-x-4">
                <div className="text-nowrap text-end">
                  <p className="text-md opacity-70">{score.mods}</p>
                  <p className="text-2xl text-primary">
                    {beatmap && beatmap.is_ranked
                      ? score.performance_points.toFixed(0)
                      : "- "}
                    {" "}
                    {t("pp")}
                  </p>
                  <p className="text-sm ">
                    {t("accuracy")} {score.accuracy.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
