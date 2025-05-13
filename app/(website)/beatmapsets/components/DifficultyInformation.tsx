import RoundedContent from "@/components/General/RoundedContent";
import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "@/components/Tooltip";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { SecondsToString } from "@/lib/utils/secondsTo";
import { Clock9, Music, Pause, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { BeatmapResponse, GameMode } from "@/lib/types/api";

interface DifficultyInformationProps {
  beatmap: BeatmapResponse;
  activeMode: GameMode;
}

export default function DifficultyInformation({
  beatmap,
  activeMode,
}: DifficultyInformationProps) {
  const { player, currentTimestamp, isPlaying, isPlayingThis, pause, play } =
    useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current) return;

    setIsPlayingCurrent(isPlayingThis(`${beatmap.beatmapset_id}.mp3`));
  }, [isPlaying]);

  const isCurrentGamemode = (gamemodes: GameMode | GameMode[]) =>
    [gamemodes].flat().includes(gameModeToVanilla(activeMode));

  const possibleKeysValue = beatmap.version
    .match(/\d+k/gi)?.[0]
    .replace(/k/gi, "");

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
        className=" relative text-xs min-h-8 bg-opacity-80 px-6 py-1 min-w-full rounded-lg overflow-hidden max-w-64"
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
            !isPlayingCurrent &&
              (currentTimestamp === player.current?.duration ||
                currentTimestamp === 0)
              ? "hidden"
              : undefined
          )}
        />
      </Button>

      <RoundedContent className="flex bg-opacity-80 flex-row items-center rounded-lg px-3 py-1 space-x-3 min-w-full justify-center  min-h-8">
        <Tooltip content="Total Length">
          <p className="flex items-center text-sm">
            <Clock9 className="h-4" />
            {SecondsToString(beatmap.total_length)}
          </p>
        </Tooltip>
        <Tooltip content="BPM">
          <p className="flex items-center text-sm">
            <Music className="h-4" />
            {beatmap.bpm}
          </p>
        </Tooltip>
        <Tooltip content="Star Rating">
          <p className="flex items-center text-sm">
            <Star className="h-4" />{" "}
            {getBeatmapStarRating(beatmap, activeMode).toFixed(2)}
          </p>
        </Tooltip>
      </RoundedContent>

      <RoundedContent className="flex bg-opacity-80 flex-col items-center rounded-lg min-w-full px-3 py-1">
        <div className="flex flex-col items-start min-w-full justify-between">
          {possibleKeysValue && isCurrentGamemode(GameMode.MANIA) && (
            <ValueWithProgressBar
              title="Key Count:"
              value={parseInt(possibleKeysValue || "4")}
            />
          )}
          {isCurrentGamemode([GameMode.STANDARD, GameMode.CATCH_THE_BEAT]) && (
            <ValueWithProgressBar title="Circle Size:" value={beatmap.cs} />
          )}
          <ValueWithProgressBar title="HP Drain:" value={beatmap.drain ?? 0} />
          <ValueWithProgressBar
            title="Accuracy:"
            value={beatmap.accuracy ?? 0}
          />
          {isCurrentGamemode([GameMode.STANDARD, GameMode.CATCH_THE_BEAT]) && (
            <ValueWithProgressBar
              title="Approach Rate:"
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
    <div className="flex flex-row items-center space-x-2 min-w-full">
      <p className="text-xs text-nowrap min-w-24">{title}</p>
      <ProgressBar maxValue={10} value={value} className="lg:max-w-24" />
      <p>{value.toFixed(1)}</p>
    </div>
  );
}
