"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import UserRankColor from "@/components/UserRankNumber";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { Score } from "@/lib/hooks/api/score/types";
import { useUserStats } from "@/lib/hooks/api/user/useUser";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

interface UserScoreMinimalProps {
  score: Score;
  showUser?: boolean;
  className?: string;
}

export default function UserScoreMinimal({
  score,
  showUser = true,
  className,
}: UserScoreMinimalProps) {
  const userStatsQuery = useUserStats(score.user_id, score.game_mode_extended);
  const beatmapQuery = useBeatmap(score.beatmap_id);

  const user = userStatsQuery.data?.user;
  const userStats = userStatsQuery.data?.stats;
  const beatmap = beatmapQuery.data;

  return (
    <div
      className={twMerge(
        "bg-card rounded-lg overflow-hidden text-white shadow",
        className
      )}
    >
      <div className="h-28 relative">
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
          <div className="absolute inset-0 bg-black hover:bg-opacity-50 bg-opacity-60 smooth-transition flex items-center cursor-pointer">
            <div className="py-2 px-4 flex place-content-between w-full h-full">
              <div className="flex-col h-full flex justify-between overflow-hidden ">
                <div className="flex-col">
                  <div className="font-bold text-sm drop-shadow-md items-center line-clamp-2">
                    {beatmap?.artist && beatmap?.title ? (
                      beatmap.artist + " - " + beatmap?.title
                    ) : (
                      <div className="flex items-center">
                        <Skeleton className="w-28 h-3" />
                        &nbsp;-&nbsp;
                        <Skeleton className="w-20 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {beatmap?.version ? (
                      <div className="line-clamp-1">
                        <p className="text-xs drop-shadow-md text-gray-100 truncate">
                          {beatmap?.version}
                        </p>
                      </div>
                    ) : (
                      <Skeleton className="w-16 h-3" />
                    )}
                  </div>
                </div>

                {showUser && (
                  <div className="flex">
                    <div className="flex items-center flex-grow min-w-0">
                      <Avatar className="h-8 w-8 border-2">
                        <Suspense
                          fallback={
                            <AvatarFallback>
                              <Skeleton className="w-4 h-4" />
                            </AvatarFallback>
                          }
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

                      <div className="line-clamp-1 mx-1">
                        <UserRankColor
                          rank={userStats?.rank ?? -1}
                          variant="primary"
                          className="truncate"
                        >
                          {user?.username ?? <Skeleton className="w-20 h-3" />}
                        </UserRankColor>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 mx-2">
                <div className="text-end text-nowrap">
                  <p className="text-md opacity-70">{score.mods}</p>
                  <p className="text-2xl text-primary">
                    {beatmap && isBeatmapRanked(beatmap)
                      ? score.performance_points.toFixed()
                      : "- "}
                    pp
                  </p>
                  <p className="text-sm ">acc: {score.accuracy.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
