"use client";
import Spinner from "@/components/Spinner";
import { Download, LucideHistory, MoreHorizontal } from "lucide-react";
import { useState, use } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import Image from "next/image";
import RoundedContent from "@/components/General/RoundedContent";
import { BeatmapStatus } from "@/lib/hooks/api/beatmap/types";
import PrettyDate from "@/components/General/PrettyDate";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import UserElement from "@/components/UserElement";

import useSelf from "@/lib/hooks/useSelf";

import { twMerge } from "tailwind-merge";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import DifficultyIcon from "@/components/DifficultyIcon";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import { Tooltip } from "@/components/Tooltip";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useUser } from "@/lib/hooks/api/user/useUser";
import { useScore } from "@/lib/hooks/api/score/useScore";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ScoreStats from "@/components/ScoreStats";

export default function Score(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const { self } = useSelf();

  const { isLoading: isReplayLoading, downloadReplay } = useDownloadReplay(
    params.id
  );

  const scoreQuery = useScore(params.id);

  const score = scoreQuery.data;

  const userQuery = useUser(score?.user_id ?? null);
  const beatmapQuery = useBeatmap(score?.beatmap_id ?? null);

  const user = userQuery?.data;
  const beatmap = beatmapQuery?.data;

  if (scoreQuery?.isLoading || userQuery?.isLoading || beatmapQuery?.isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  const errorMessage =
    scoreQuery.error?.message ??
    userQuery?.error?.message ??
    beatmapQuery?.error?.message ??
    "Score not found";

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader
        text="Score Performance"
        roundBottom
        icon={<LucideHistory />}
      />
      <RoundedContent className="space-y-2 rounded-lg">
        {score && user && beatmap ? (
          <>
            <div>
              <div className="z-20 md:h-64 relative">
                <div className="bg-black/60 p-4 place-content-between flex md:flex-row flex-col h-full  rounded-lg">
                  <div className="w-full h-full flex flex-col overflow-hidden">
                    <Link
                      href={`/beatmapsets/${beatmap?.beatmapset_id}/${beatmap?.id}`}
                    >
                      <div className="flex font-bold text-xl drop-shadow-md items-center ">
                        <span className="pr-1">
                          <BeatmapStatusIcon
                            status={beatmap.status ?? BeatmapStatus.Graveyard}
                          />
                        </span>
                        <span className="line-clamp-3 text-white">
                          {beatmap.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-base drop-shadow-md text-gray-100 line-clamp-2">
                          {beatmap.artist}
                        </div>
                      </div>
                    </Link>
                    <div
                      className={`text-${getGradeColor(
                        score.grade
                      )} mx-auto my-auto mt-8 md:mt-0 md:mx-0 md:my-0 text-9xl font-bold`}
                    >
                      {score.grade}
                    </div>
                  </div>

                  <Separator className="my-4 h-0 block md:hidden" />

                  <div className="items-center md:flex flex-col place-content-between space-y-4 w-full md:w-1/2">
                    <div className="flex flex-col w-full">
                      <div className="flex justify-end flex-row">
                        <div className="flex justify-end w-full">
                          <div className="text-yellow-400 text-base line-clamp-2 flex flex-col items-end max-w-full">
                            <div className="flex flex-row items-center w-full">
                              <span className="mr-1">[</span>
                              <div className="flex items-center flex-1 overflow-hidden">
                                <span className="truncate">
                                  {beatmap?.version || "Unknown"}
                                </span>
                              </div>
                              <DifficultyIcon
                                iconColor="#facc15"
                                gameMode={score.game_mode}
                                className="text-base mx-1 flex-shrink-0"
                              />
                              <span className="ml-1">]</span>
                              <p className="whitespace-nowrap">
                                ★{" "}
                                {beatmap &&
                                  getBeatmapStarRating(beatmap).toFixed(2)}{" "}
                                {score.mods}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-right">
                        mapped by {beatmap?.creator || "Unknown Creator"}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="text-5xl font-bold text-right text-white">
                        {score.total_score.toLocaleString()}
                      </p>
                      <div className="text-right">
                        <div className="flex flex-row items-center justify-end text-nowrap">
                          <p className="text-gray-200">Submitted on&nbsp;</p>
                          <PrettyDate
                            className="text-gray-200"
                            time={score.when_played}
                          />
                        </div>

                        <p className="text-gray-200">
                          Played by {user?.username ?? "Unknown user"}
                        </p>
                      </div>
                    </div>

                    <div className="space-x-2 flex justify-end w-full">
                      <Button
                        onClick={downloadReplay}
                        disabled={!self || !score.has_replay}
                        isLoading={isReplayLoading}
                        variant="secondary"
                      >
                        <Download />
                        Download Replay
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" disabled={!self || true}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* 
                      TODO: Implement 
                      <DropdownMenuItem onClick={() => console.log("todo")}>
                        Report score 
                      </DropdownMenuItem>

                      TODO: Implement 
                      <DropdownMenuItem onClick={() => console.log("todo")}>
                        Pin score 
                      </DropdownMenuItem>*/}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="-z-10 absolute inset-0 overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover@2x.jpg`}
                    alt="beatmap image"
                    fill={true}
                    objectFit="cover"
                    className="relative"
                    fallBackSrc="/images/unknown-beatmap-banner.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2">
                <UserElement user={user} />
              </div>

              <div className="hidden xl:grid" />

              <div className="xl:col-span-2">
                <ScoreStats score={score} beatmap={beatmap} variant="score" />
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl">{errorMessage}</h1>
              <p>
                The score you are looking for does not exist or has been
                deleted.
              </p>
            </div>
            <Image
              src="/images/user-not-found.png"
              alt="404"
              width={200}
              height={400}
              className="max-w-fit"
            />
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
