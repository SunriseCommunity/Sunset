"use client";
import { Book, Clapperboard, Info, Music2 } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useEffect, useState } from "react";
import GameModeSelector, { GameRuleFlags } from "@/components/GameModeSelector";
import ImageWithFallback from "@/components/ImageWithFallback";
import PrettyDate from "@/components/General/PrettyDate";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import { Tooltip } from "@/components/Tooltip";
import DifficultySelector from "@/app/beatmapsets/components/DifficultySelector";
import DownloadButtons from "@/app/beatmapsets/components/DownloadButtons";
import DifficultyInformation from "@/app/beatmapsets/components/DifficultyInformation";
import FavouriteButton from "@/app/beatmapsets/components/FavouriteButton";
import Spinner from "@/components/Spinner";
import BeatmapLeaderboard from "@/app/beatmapsets/components/BeatmapLeaderboard";
import OpenBanchoButton from "@/app/beatmapsets/components/OpenBanchoButton";
import { gameModeToVanilla } from "@/lib/utils/gameModeToVanilla";
import Image from "next/image";
import { GameMode } from "@/lib/hooks/api/types";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { useBeatmapSet } from "@/lib/hooks/api/beatmap/useBeatmapSet";

export interface BeatmapsetProps {
  params: { ids: [number?, number?] };
}

export default function Beatmapset({ params }: BeatmapsetProps) {
  const [beatmapSetId, beatmapId] = params.ids;

  const [activeMode, setActiveMode] = useState(GameMode.std);
  const [activeGameRule, setActiveGameRule] = useState(GameRuleFlags.Standard);
  const [activeBeatmap, _setActiveBeatmap] = useState<Beatmap | null>(null);

  const beatmapsetQuery = useBeatmapSet(beatmapSetId ?? null);
  const beatmapSet = beatmapsetQuery.data;

  useEffect(() => {
    if (!beatmapSet) return;

    const beatmap = beatmapSet.beatmaps.find(
      (beatmap) => beatmap.id === parseInt(beatmapId as any)
    );

    const activeBeatmap = beatmap || beatmapSet.beatmaps[0];

    setActiveBeatmap(activeBeatmap);
    setActiveMode(activeBeatmap.mode_int);
  }, [beatmapSet]);

  useEffect(() => {
    if (
      !beatmapSet ||
      [activeMode % 4, GameMode.std].includes(
        activeBeatmap?.mode_int ?? GameMode.std
      )
    )
      return;

    const beatmap = beatmapSet.beatmaps.find(
      (beatmap) => beatmap.mode_int === activeMode
    );

    const activeBeatmapNew = beatmap || beatmapSet.beatmaps[0];

    setActiveBeatmap(activeBeatmapNew);
    setActiveMode(activeBeatmapNew.mode_int);
  }, [activeMode]);

  const setActiveBeatmap = (difficulty: Beatmap) => {
    _setActiveBeatmap(difficulty);

    window.history.pushState(
      null,
      "",
      `/beatmapsets/${beatmapSetId}/${difficulty.id}`
    );
  };

  if (beatmapsetQuery.isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  if (!beatmapSet || !activeBeatmap) {
    return (
      <main className="container mx-auto my-8">
        <PrettyHeader
          icon={<Music2 />}
          text="Beatmap info"
          className="bg-terracotta-700 mb-4"
          roundBottom={true}
        />
        <RoundedContent className="bg-terracotta-700 rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl">Beatmapset not found</h1>
            <p className="text-gray-300">
              The beatmapset you are looking for does not exist or has been
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
        </RoundedContent>
      </main>
    );
  }

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        icon={<Music2 />}
        text="Beatmap info"
        className="bg-terracotta-700 mb-4"
        roundBottom={true}
      >
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          activeGameRule={activeGameRule}
          setActiveGameRule={setActiveGameRule}
          includeGameRules={false}
          enabledModes={
            beatmapSet &&
            beatmapSet.beatmaps.some(
              (beatmap) => beatmap.mode_int === GameMode.std
            )
              ? undefined
              : [
                  ...(beatmapSet?.beatmaps.map((beatmap) => beatmap.mode_int) ??
                    []),
                ]
          }
        />
      </PrettyHeader>

      <RoundedContent className="bg-terracotta-700 rounded-lg p-0">
        {/* Banner */}
        <div className="h-80 relative">
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/cover.jpg`}
            alt=""
            fill={true}
            className="bg-stone-700 rounded-t-lg object-cover"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />
          <div className="absolute inset-0 bg-terracotta-800 bg-opacity-80 lg:px-6 md:p-4 p-2 rounded-t-lg">
            <div className="flex justify-between mb-4 h-full">
              <div className="flex flex-col justify-between">
                <DifficultySelector
                  beatmapset={beatmapSet}
                  activeDifficulty={activeBeatmap}
                  setDifficulty={setActiveBeatmap}
                  activeGameMode={gameModeToVanilla(activeMode)}
                  difficulties={beatmapSet.beatmaps.filter((beatmap) =>
                    [gameModeToVanilla(activeMode), GameMode.std].includes(
                      beatmap.mode_int
                    )
                  )}
                />

                <div>
                  <h3 className="text-3xl font-bold">{beatmapSet.title}</h3>
                  <p className="text-gray-200 text-lg">{beatmapSet.artist}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row items-center">
                    <ImageWithFallback
                      src={`https://a.ppy.sh/${beatmapSet.creator_id}`}
                      alt=""
                      width={48}
                      height={48}
                      className="rounded-lg object-contain bg-stone-800 max-h-12 max-w-12"
                      fallBackSrc="/images/placeholder.png"
                    />
                    <div className="flex flex-col ml-2 text-xs font-light">
                      <p className="flex items-center">
                        submitted by&nbsp;
                        <p className="font-bold">
                          {beatmapSet.creator || "Unknown"}
                        </p>
                      </p>
                      <p className="flex items-center">
                        submitted on&nbsp;
                        <PrettyDate
                          time={beatmapSet.submitted_date}
                          className="font-bold"
                        />
                      </p>
                      {beatmapSet.ranked_date && (
                        <p className="flex items-center">
                          ranked on&nbsp;
                          <PrettyDate
                            time={beatmapSet.ranked_date}
                            className="font-bold"
                          />
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <FavouriteButton beatmapSet={beatmapSet} />
                    <DownloadButtons beatmapSet={beatmapSet} />
                    <OpenBanchoButton beatmapSet={beatmapSet} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between min-w-64">
                <div className="flex flex-row space-x-1">
                  {beatmapSet.video && (
                    <div className="bg-terracotta-800 bg-opacity-80 p-2 rounded-lg">
                      <Tooltip content="This beatmap contains video">
                        <Clapperboard className="h-5" />
                      </Tooltip>
                    </div>
                  )}
                  <div className="bg-terracotta-800 bg-opacity-80 py-2 px-8 rounded-lg flex flex-row w-full">
                    <p className="flex mx-auto space-x-1">
                      <BeatmapStatusIcon status={activeBeatmap.status} />
                      <p className="capitalize">{activeBeatmap.status}</p>
                    </p>
                  </div>
                </div>
                <DifficultyInformation
                  beatmap={activeBeatmap}
                  activeMode={gameModeToVanilla(activeMode)}
                />
              </div>
            </div>
          </div>
        </div>
      </RoundedContent>

      <RoundedContent className="mb-4 bg-terracotta-600 rounded-b-lg p-0 space-y-2">
        <RoundedContent className="px-4 pt-4 pb-0 min-h-72 max-h-72 h-72 flex bg-terracotta-600 place-content-between space-x-2 mb-4">
          <div className="flex flex-col w-2/4 ">
            <PrettyHeader
              icon={<Book />}
              text="Description"
              className="font-normal py-2 px-4"
            />
            {/* TODO: Make spoilerbox work as intended */}
            <RoundedContent className="min-h-0 h-full overflow-y-auto">
              <div
                className="font-normal text-sm w-full"
                dangerouslySetInnerHTML={{ __html: beatmapSet.description }}
              />
            </RoundedContent>
          </div>

          <div className="flex flex-col w-1/4">
            <PrettyHeader
              icon={<Info />}
              text="Information"
              className="font-normal py-2 px-4"
            />
            <RoundedContent className="space-y-4 h-full overflow-y-auto min-h-0">
              <div>
                <div className="flex place-content-between items-end">
                  <p className="text-xs">Genre</p>
                  <p className="text-md font-bald">{beatmapSet.genre}</p>
                </div>
                <div className="flex place-content-between items-end">
                  <p className="text-xs">Language</p>
                  <p className="text-md font-bald">{beatmapSet.language}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-xs">Tags</p>
                <p className="text-sm font-light">
                  {beatmapSet.tags.map((tag) => `${tag}`).join(", ")}
                </p>
              </div>
            </RoundedContent>
          </div>
        </RoundedContent>
        {activeBeatmap.is_scoreable && (
          <div className="flex flex-col w-full">
            <RoundedContent className="rounded-md mx-4 mt-4">
              <GameModeSelector
                activeMode={activeMode}
                setActiveMode={setActiveMode}
                activeGameRule={activeGameRule}
                setActiveGameRule={setActiveGameRule}
                includeGameModes={false}
              />
            </RoundedContent>

            <BeatmapLeaderboard beatmap={activeBeatmap} mode={activeMode} />
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
