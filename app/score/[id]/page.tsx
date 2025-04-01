"use client";
import Spinner from "@/components/Spinner";
import { Download, LucideHistory } from "lucide-react";
import { useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import Image from "next/image";
import RoundedContent from "@/components/General/RoundedContent";
import { BeatmapStatus } from "@/lib/hooks/api/beatmap/types";
import PrettyDate from "@/components/General/PrettyDate";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import UserElement from "@/components/UserElement";
import PrettyButton from "@/components/General/PrettyButton";
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

export default function Score({ params }: { params: { id: number } }) {
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

  if (scoreQuery.isLoading || userQuery?.isLoading || beatmapQuery?.isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  if (!score || scoreQuery.error || userQuery?.error || beatmapQuery?.error) {
    return (
      <main className="container mx-auto my-8">
        <PrettyHeader text="Score Performance" icon={<LucideHistory />} />
        <RoundedContent className="bg-terracotta-700 rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl">Score not found</h1>
            <p className="text-gray-300">
              The score you are looking for does not exist or has been deleted.
            </p>
          </div>
          <Image
            src="/images/user-not-found.png"
            alt="404"
            width={200}
            height={400}
            className="max-w-fit"
          />
        </RoundedContent>
      </main>
    );
  }

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader text="Score Performance" icon={<LucideHistory />} />
      <RoundedContent className="min-h-0 h-fit max-h-none mb-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="h-64 relative">
              <ImageWithFallback
                src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
                alt=""
                fill={true}
                objectFit="cover"
                className="bg-stone-700 rounded-lg"
                fallBackSrc="/images/unknown-beatmap-banner.jpg"
              />
              <div className="absolute inset-0 bg-terracotta-800 bg-opacity-80 lg:p-6 md:p-4 p-2 rounded-lg overflow-hidden flex-wrap">
                <div className="flex justify-between items-center mb-4">
                  <a
                    href={`/beatmapsets/${beatmap?.beatmapset_id}/${beatmap?.id}`}
                    className="overflow-hidden flex-wrap"
                  >
                    <div className="flex items-center space-x-2">
                      <BeatmapStatusIcon
                        status={beatmap?.status ?? BeatmapStatus.Graveyard}
                      />
                      <h3 className="text-lg font-bold text-nowrap">
                        {beatmap?.title}
                      </h3>
                    </div>

                    <p className="text-gray-300 text-nowrap">
                      by {beatmap?.artist}
                    </p>
                  </a>
                  <div className="text-right w-3/4">
                    <div className="flex flex-row items-center justify-end w-full">
                      <p className="text-yellow-400 text-base justify-end  flex flex-row w-full">
                        <p className="flex flex-row items-center max-w-[50%]">
                          {" "}
                          [
                          <p className="truncate overflow-hidden whitespace-nowrap">
                            {beatmap?.version || "Unknown"}
                          </p>
                          <DifficultyIcon
                            iconColor="#facc15"
                            gameMode={score.game_mode}
                            className="w-5 h-5 mx-2"
                          />{" "}
                          ]
                        </p>
                        <p>
                          ★{" "}
                          {beatmap && getBeatmapStarRating(beatmap).toFixed(2)}{" "}
                          {score.mods}
                        </p>
                      </p>
                    </div>
                    <p className="text-gray-300">
                      mapped by {beatmap?.creator || "Unknown Creator"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div
                    className={`text-${getGradeColor(
                      score.grade
                    )} text-9xl font-bold`}
                  >
                    {score.grade}
                  </div>
                  <div>
                    <p className="text-5xl font-bold text-right">
                      {score.total_score.toLocaleString()}
                    </p>
                    <div className="text-right">
                      <div className="flex flex-row items-center justify-end">
                        <p className="text-gray-200">Submitted on&nbsp;</p>
                        <PrettyDate
                          className="text-gray-200"
                          time={score.when_played}
                        />
                      </div>
                      <p className="text-gray-200">
                        Played by {user?.username ?? "Unknown user"}
                      </p>
                      <PrettyButton
                        onClick={downloadReplay}
                        text="Download Replay"
                        icon={<Download />}
                        className="py-1 px-2 mt-2"
                        disabled={!self || !score.has_replay}
                        isLoading={isReplayLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <UserElement user={user} className="" />

              <div className="hidden xl:grid"></div>

              <div className="flex flex-col ">
                <div className="grid grid-cols-3 gap-4 mb-1">
                  <div className="bg-terracotta-800 p-3 rounded">
                    <p className="text-gray-400">Accuracy</p>
                    <p className="text-base font-bold">
                      {score.accuracy.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-terracotta-800 p-3 rounded">
                    <p className="text-gray-400">Combo</p>
                    <p
                      className={twMerge(
                        "text-base font-bold",
                        score.max_combo === beatmap?.max_combo
                          ? "text-terracotta-300"
                          : ""
                      )}
                    >
                      {score.max_combo}x
                    </p>
                  </div>
                  <div className="bg-terracotta-800 p-3 rounded">
                    <p className="text-gray-400">PP</p>
                    <p className="text-base font-bold items-center flex">
                      {score.performance_points.toFixed(2)}
                      {beatmap && !isBeatmapRanked(beatmap) && (
                        <Tooltip content={`If ranked`}>
                          <span className="text-yellow-500 ml-1">*</span>
                        </Tooltip>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">300</p>
                    <p className="text-base">{score.count_300}</p>
                  </div>
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">100</p>
                    <p className="text-base">{score.count_100}</p>
                  </div>
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">50</p>
                    <p className="text-base">{score.count_50}</p>
                  </div>
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">Miss</p>
                    <p className="text-base">{score.count_miss}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoundedContent>
    </div>
  );
}
