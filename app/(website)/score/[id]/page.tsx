"use client";
import { Download, LucideHistory, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import DifficultyIcon from "@/components/DifficultyIcon";
import PrettyDate from "@/components/General/PrettyDate";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ModIcons } from "@/components/ModIcons";
import ScoreStats from "@/components/ScoreStats";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import UserElement from "@/components/UserElement";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import { useScore } from "@/lib/hooks/api/score/useScore";
import { useUser } from "@/lib/hooks/api/user/useUser";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { tryParseNumber } from "@/lib/utils/type.util";

export default function Score(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const paramsId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.score");

  const { self } = useSelf();

  const [useSpaciousUI] = useState(() => {
    if (typeof window === "undefined")
      return false;
    return localStorage.getItem("useSpaciousUI") === "true";
  });

  const { isLoading: isReplayLoading, downloadReplay }
    = useDownloadReplay(paramsId);

  const scoreQuery = useScore(paramsId);

  const score = scoreQuery.data;

  const userQuery = useUser(score?.user_id ?? null);
  const beatmapQuery = useBeatmap(score?.beatmap_id ?? null);

  const user = userQuery?.data;
  const beatmap = beatmapQuery?.data;

  if (
    scoreQuery?.isLoading
    || userQuery?.isLoading
    || beatmapQuery?.isLoading
  ) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  const errorMessage
    = scoreQuery.error?.message
      ?? userQuery?.error?.message
      ?? beatmapQuery?.error?.message
      ?? t("error.notFound");

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader text={t("header")} roundBottom icon={<LucideHistory />} />
      <RoundedContent className="space-y-2 rounded-lg">
        {score && user && beatmap ? (
          <>
            <div>
              <div className="md:h-68 relative z-20">
                <div className="flex h-full flex-col place-content-between rounded-lg bg-black/60 p-4  md:flex-row">
                  <div className="flex size-full flex-col overflow-hidden">
                    <Link
                      href={`/beatmapsets/${beatmap?.beatmapset_id}/${beatmap?.id}`}
                    >
                      <div className="flex items-center text-xl font-bold drop-shadow-md ">
                        <span className="pr-1">
                          <BeatmapStatusIcon
                            status={beatmap.status ?? BeatmapStatusWeb.GRAVEYARD}
                          />
                        </span>
                        <span className="line-clamp-3 text-white">
                          {beatmap.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="line-clamp-2 text-base text-gray-100 drop-shadow-md">
                          {beatmap.artist}
                        </div>
                      </div>
                    </Link>
                    <div
                      className={`text-${getGradeColor(
                        score.grade,
                      )} m-auto mt-8 text-9xl font-bold md:m-0`}
                    >
                      {score.grade}
                    </div>
                    <span className="my-auto mb-0 line-clamp-3 text-xl font-bold md:pt-0">
                      <ModIcons modsBitset={score.mods_int ?? 0} />
                    </span>
                  </div>

                  <Separator className="my-4 block h-0 md:hidden" />

                  <div className="w-full flex-col place-content-between items-center space-y-4 md:flex md:w-1/2">
                    <div className="flex w-full flex-col">
                      <div className="flex flex-row justify-end">
                        <div className="flex w-full justify-end">
                          <div className="line-clamp-2 flex max-w-full flex-col items-end text-base text-yellow-400">
                            <div className="flex w-full flex-row items-center">
                              <DifficultyIcon
                                iconColor="#facc15"
                                gameMode={score.game_mode}
                                className="mx-1 flex-shrink-0 text-base"
                              />
                              <p className="whitespace-nowrap">
                                ★
                                {" "}
                                {beatmap
                                  && getBeatmapStarRating(beatmap).toFixed(2)}
                                {" "}
                              </p>
                              <span className="ml-2">[</span>
                              <div className="flex flex-1 items-center overflow-hidden">
                                <span className="truncate">
                                  {beatmap?.version
                                    || t("beatmap.versionUnknown")}
                                </span>
                              </div>
                              <span>]</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-right text-gray-300">
                        {t("beatmap.mappedBy")}
                        {" "}
                        {beatmap?.creator || t("beatmap.creatorUnknown")}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="text-right text-5xl font-bold text-white">
                        {score.total_score.toLocaleString()}
                      </p>
                      <div className="text-right">
                        <div className="flex flex-row items-center justify-end text-nowrap">
                          <p className="text-gray-200">
                            {t("score.submittedOn")}&nbsp;
                          </p>
                          <PrettyDate
                            className="text-gray-200"
                            time={score.when_played}
                          />
                        </div>

                        <p className="text-gray-200">
                          {t("score.playedBy")}
                          {" "}
                          {user?.username ?? t("score.userUnknown")}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full justify-end space-x-2">
                      <Button
                        onClick={downloadReplay}
                        disabled={!self || !score.has_replay}
                        isLoading={isReplayLoading}
                        variant="secondary"
                      >
                        <Download />
                        {t("actions.downloadReplay")}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" disabled={!self || true}>
                            <span className="sr-only">
                              {t("actions.openMenu")}
                            </span>
                            <MoreHorizontal className="size-4" />
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
                      </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5">
              <div className="xl:col-span-2">
                <UserElement user={user} />
              </div>

              {useSpaciousUI && <div className="hidden xl:grid" />}

              <div
                className={useSpaciousUI ? "xl:col-span-2" : "xl:col-span-3"}
              >
                <ScoreStats score={score} beatmap={beatmap} variant="score" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-between gap-8 rounded-l md:flex-row md:items-start ">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl">{errorMessage}</h1>
              <p>{t("error.description")}</p>
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
