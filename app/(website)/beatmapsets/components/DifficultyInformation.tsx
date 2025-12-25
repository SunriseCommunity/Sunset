import { Clock9, Music, Pause, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import RoundedContent from "@/components/General/RoundedContent";
import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { SecondsToString } from "@/lib/utils/secondsTo";

interface DifficultyInformationProps {
  beatmap: BeatmapResponse;
  activeMode: GameMode;
}

export default function DifficultyInformation({
  beatmap,
  activeMode,
}: DifficultyInformationProps) {
  const t = useT("pages.beatmapsets.components.difficultyInformation");
  const { player, currentTimestamp, isPlaying, isPlayingThis, pause, play }
    = useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current)
      return;

    setIsPlayingCurrent(isPlayingThis(`${beatmap.beatmapset_id}.mp3`));
  }, [beatmap.beatmapset_id, isPlaying, isPlayingThis, player]);

  const isCurrentGamemode = (gamemodes: GameMode | GameMode[]) =>
    [gamemodes].flat().includes(gameModeToVanilla(activeMode));

  const possibleKeysValue = beatmap.version
    .match(/\d+k/gi)?.[0]
    .replaceAll(/k/gi, "");

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        onClick={() => {
          if (isPlaying && isPlayingCurrent) {
            pause();
            return;
          }

          play(`https://b.ppy.sh/preview/${beatmap.beatmapset_id}.mp3`);
        }}
        size="sm"
        variant="accent"
        className="relative min-h-8 w-full min-w-64 overflow-hidden rounded-lg bg-opacity-80 px-6 py-1 text-xs"
      >
        {isPlayingCurrent ? (
          <Pause className="h-5" />
        ) : (
          <Play className="h-5" />
        )}
        <ProgressBar
          value={currentTimestamp}
          maxValue={player.current?.duration || 10}
          className={twMerge(
            "absolute bottom-0 left-0 w-full h-0.5",
            !isPlayingCurrent
            && (currentTimestamp === player.current?.duration
              || currentTimestamp === 0)
              ? "hidden"
              : undefined,
          )}
        />
      </Button>

      <RoundedContent className="flex min-h-8 min-w-full flex-row items-center justify-center space-x-3 rounded-lg bg-opacity-80 px-3  py-1">
        <Tooltip content={t("tooltips.totalLength")}>
          <p className="flex items-center text-sm">
            <Clock9 className="h-4" />
            {SecondsToString(beatmap.total_length)}
          </p>
        </Tooltip>
        <Tooltip content={t("tooltips.bpm")}>
          <p className="flex items-center text-sm">
            <Music className="h-4" />
            {beatmap.bpm}
          </p>
        </Tooltip>
        <Tooltip content={t("tooltips.starRating")}>
          <p className="flex items-center text-sm">
            <Star className="h-4" />
            {" "}
            {getBeatmapStarRating(beatmap, activeMode).toFixed(2)}
          </p>
        </Tooltip>
      </RoundedContent>

      <RoundedContent className="flex min-w-full flex-col items-center rounded-lg bg-opacity-80 px-3 py-1">
        <div className="flex w-fit min-w-full flex-col items-start justify-between">
          {possibleKeysValue && isCurrentGamemode(GameMode.MANIA) && (
            <ValueWithProgressBar
              title={t("labels.keyCount")}
              value={Number.parseInt(possibleKeysValue || "4", 10)}
            />
          )}
          {isCurrentGamemode([GameMode.STANDARD, GameMode.CATCH_THE_BEAT]) && (
            <ValueWithProgressBar
              title={t("labels.circleSize")}
              value={beatmap.cs}
            />
          )}
          <ValueWithProgressBar
            title={t("labels.hpDrain")}
            value={beatmap.drain ?? 0}
          />
          <ValueWithProgressBar
            title={t("labels.accuracy")}
            value={beatmap.accuracy ?? 0}
          />
          {isCurrentGamemode([GameMode.STANDARD, GameMode.CATCH_THE_BEAT]) && (
            <ValueWithProgressBar
              title={t("labels.approachRate")}
              value={beatmap.ar ?? 0}
            />
          )}
        </div>
      </RoundedContent>
    </div>
  );
}

function ValueWithProgressBar({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="flex min-w-full flex-row items-center space-x-2">
      <p className="min-w-24 flex-shrink-0 text-nowrap text-xs">{title}</p>
      <ProgressBar maxValue={10} value={value} className="lg:max-w-24" />
      <p>{value.toFixed(1)}</p>
    </div>
  );
}
