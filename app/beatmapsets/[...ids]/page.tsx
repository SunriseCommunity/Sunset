"use client";
import { Book, Clapperboard, Info, Music2 } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useEffect, useState, use, useCallback } from "react";
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
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import Image from "next/image";
import { useBeatmapSet } from "@/lib/hooks/api/beatmap/useBeatmapSet";
import GameModeSelector from "@/components/GameModeSelector";
import { BeatmapDropdown } from "@/app/beatmapsets/components/BeatmapDropdown";
import { usePathname, useSearchParams } from "next/navigation";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { BeatmapDescription } from "@/app/beatmapsets/components/BeatmapDescriptions";
import { BeatmapResponse, GameMode } from "@/lib/types/api";

export interface BeatmapsetProps {
  params: Promise<{ ids: [string?, string?] }>;
}

export default function Beatmapset(props: BeatmapsetProps) {
  const params = use(props.params);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "";

  const [beatmapSetId, beatmapId] = params.ids;

  const [activeMode, setActiveMode] = useState<GameMode | null>(
    isInstance(mode, GameMode) ? (mode as GameMode) : null
  );

  const [activeBeatmap, setActiveBeatmap] = useState<BeatmapResponse | null>(
    null
  );

  const beatmapsetQuery = useBeatmapSet(
    tryParseNumber(beatmapSetId ?? "") ?? null
  );
  const beatmapSet = beatmapsetQuery.data;

  useEffect(() => {
    if (!beatmapSet) return;

    const beatmap = beatmapSet.beatmaps.find(
      (beatmap) => beatmap.id === Number(beatmapId)
    );

    const activeBeatmap = beatmap ?? beatmapSet.beatmaps[0];

    setActiveBeatmap(activeBeatmap);
    if (!activeMode) setActiveMode(activeBeatmap.mode);
  }, [beatmapSet]);

  useEffect(() => {
    if (
      !beatmapSet ||
      [activeMode && gameModeToVanilla(activeMode), GameMode.STANDARD].includes(
        activeBeatmap?.mode ?? GameMode.STANDARD
      )
    )
      return;

    const beatmap = beatmapSet.beatmaps.find(
      (beatmap) => beatmap.mode === activeMode
    );

    const activeBeatmapNew = beatmap ?? beatmapSet.beatmaps[0];

    setActiveBeatmap(activeBeatmapNew);
    setActiveMode(activeBeatmapNew.mode);
  }, [activeMode]);

  useEffect(() => {
    if (!activeMode) return;

    window.history.pushState(
      null,
      "",
      pathname + "?" + createQueryString("mode", activeMode.toString())
    );
  }, [activeMode]);

  useEffect(() => {
    if (!activeBeatmap) return;

    if (activeBeatmap.id.toString() !== beatmapId) {
      window.history.pushState(
        null,
        "",
        `/beatmapsets/${beatmapSetId}/${activeBeatmap.id}?` +
          searchParams.toString()
      );
    }
  }, [activeBeatmap]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  if (beatmapsetQuery.isLoading || !activeMode)
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  const errorMessage =
    beatmapsetQuery?.error?.message ?? "Beatmapset not found";

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<Music2 />} text="Beatmap info" roundBottom={true}>
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          includeGameRules={false}
          enabledModes={
            beatmapSet &&
            beatmapSet.beatmaps.some(
              (beatmap) => beatmap.mode === GameMode.STANDARD
            )
              ? undefined
              : [...(beatmapSet?.beatmaps.map((beatmap) => beatmap.mode) ?? [])]
          }
        />
      </PrettyHeader>

      <RoundedContent className="rounded-lg p-0 h-full">
        {beatmapSet && activeBeatmap ? (
          <>
            <div>
              <div className="z-20 lg:h-80 relative">
                <div className="bg-black/60 lg:px-6 md:p-4 p-2 rounded-t-lg h-full">
                  <div className="flex lg:flex-row space-y-4 lg:space-y-0 flex-col justify-between lg:mb-4 h-full">
                    <div className="flex flex-col space-y-6 lg:space-y-0 justify-between">
                      <DifficultySelector
                        beatmapset={beatmapSet}
                        activeDifficulty={activeBeatmap}
                        setDifficulty={setActiveBeatmap}
                        activeGameMode={gameModeToVanilla(activeMode)}
                        difficulties={beatmapSet.beatmaps.filter((beatmap) =>
                          [
                            gameModeToVanilla(activeMode),
                            GameMode.STANDARD,
                          ].includes(beatmap.mode)
                        )}
                      />

                      <div>
                        <h3 className="text-3xl font-bold text-white">
                          {beatmapSet.title}
                        </h3>
                        <p className="text-gray-200 text-lg">
                          {beatmapSet.artist}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2 text-white">
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
                            <div className="flex items-center">
                              submitted by&nbsp;
                              <p className="font-bold">
                                {beatmapSet.creator || "Unknown"}
                              </p>
                            </div>
                            <div className="flex items-center">
                              submitted on&nbsp;
                              <PrettyDate
                                time={beatmapSet.submitted_date}
                                className="font-bold"
                              />
                            </div>
                            {beatmapSet.ranked_date && (
                              <div className="flex items-center">
                                ranked on&nbsp;
                                <PrettyDate
                                  time={beatmapSet.ranked_date}
                                  className="font-bold"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap flex-row items-center gap-2">
                          <FavouriteButton beatmapSet={beatmapSet} />
                          <DownloadButtons beatmapSet={beatmapSet} />
                          <BeatmapDropdown
                            activeMode={activeMode}
                            beatmap={activeBeatmap}
                            beatmapSet={beatmapSet}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between min-w-64 space-y-4 lg:space-y-0">
                      <div className="flex flex-row space-x-1">
                        {beatmapSet.video && (
                          <div className="bg-accent bg-opacity-80 p-2 rounded-lg">
                            <Tooltip content="This beatmap contains video">
                              <Clapperboard className="h-5" />
                            </Tooltip>
                          </div>
                        )}
                        <div className="bg-accent bg-opacity-80 py-2 px-8 rounded-lg flex flex-row w-full">
                          <div className="flex mx-auto space-x-1">
                            <BeatmapStatusIcon status={activeBeatmap.status} />
                            <p className="capitalize">{activeBeatmap.status}</p>
                          </div>
                        </div>
                      </div>
                      <DifficultyInformation
                        beatmap={activeBeatmap}
                        activeMode={gameModeToVanilla(activeMode)}
                      />
                    </div>
                  </div>
                </div>

                <div className="-z-10 absolute inset-0 overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
                    alt="beatmap image"
                    fill={true}
                    objectFit="cover"
                    className="relative"
                    fallBackSrc="/images/unknown-beatmap-banner.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-card">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="flex flex-col lg:col-span-3 lg:h-80">
                  <PrettyHeader
                    icon={<Book />}
                    text="Description"
                    className="font-normal py-2 px-4"
                  />
                  <RoundedContent className="min-h-0 h-full overflow-y-auto">
                    <BeatmapDescription
                      descriptionHtml={beatmapSet.description}
                    />
                  </RoundedContent>
                </div>

                <div className="hidden lg:grid" />

                <div className="flex flex-col lg:col-span-2 lg:h-80">
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
                        <p className="text-md font-bald">
                          {beatmapSet.language}
                        </p>
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
              </div>

              {activeBeatmap.is_scoreable && (
                <div className="flex flex-col w-full space-y-4">
                  <PrettyHeader className="rounded-md mt-4">
                    <GameModeSelector
                      activeMode={activeMode}
                      setActiveMode={setActiveMode}
                      includeGameModes={false}
                    />
                  </PrettyHeader>

                  <BeatmapLeaderboard
                    beatmap={activeBeatmap}
                    mode={activeMode}
                  />
                </div>
              )}
            </div>
          </>
        ) : beatmapsetQuery?.error ? (
          <RoundedContent className="rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl">{errorMessage}</h1>
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
        ) : null}
      </RoundedContent>
    </div>
  );
}
