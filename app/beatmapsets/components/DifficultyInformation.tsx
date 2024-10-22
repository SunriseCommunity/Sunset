import PrettyButton from "@/components/General/PrettyButton";
import RoundedContent from "@/components/General/RoundedContent";
import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "@/components/Tooltip";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { Beatmap } from "@/lib/types/Beatmap";
import { GameMode } from "@/lib/types/GameMode";
import { SecondsToString } from "@/lib/utils/secondsTo";
import { Clock9, Music, Pause, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DifficultyInformationProps {
  beatmap: Beatmap;
}

export default function DifficultyInformation({
  beatmap,
}: DifficultyInformationProps) {
  const { player, currentTimestamp, isPlaying, isPlayingThis, pause, play } =
    useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current) return;

    setIsPlayingCurrent(isPlayingThis(`${beatmap.beatmapset_id}.mp3`));
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center space-y-1">
      <PrettyButton
        onClick={() => {
          if (isPlaying && isPlayingCurrent) {
            pause();
            return;
          }

          play(`https://b.ppy.sh/preview/${beatmap.beatmapset_id}.mp3`);
        }}
        icon={
          isPlayingCurrent ? (
            <Pause className="h-5" />
          ) : (
            <Play className="h-5" />
          )
        }
        className="relative text-xs min-h-8 bg-terracotta-800 bg-opacity-80 px-6 py-1 min-w-full rounded-lg overflow-hidden max-w-64"
      >
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
      </PrettyButton>

      <RoundedContent className="flex bg-terracotta-800 bg-opacity-80 flex-row items-center rounded-lg px-3 py-1 space-x-3 min-w-full justify-center  min-h-8">
        <Tooltip content="Total Length">
          <p className="flex items-center text-sm">
            <Clock9 className="h-4 text-yellow-pastel" />
            {SecondsToString(beatmap.total_length)}
          </p>
        </Tooltip>
        <Tooltip content="BPM">
          <p className="flex items-center text-sm">
            <Music className="h-4 text-yellow-pastel" />
            {beatmap.bpm}
          </p>
        </Tooltip>
        <Tooltip content="Star Rating">
          <p className="flex items-center text-sm">
            <Star className="h-4 text-yellow-pastel" />{" "}
            {beatmap.star_rating.toFixed(2)}
          </p>
        </Tooltip>
      </RoundedContent>

      <RoundedContent className="flex bg-terracotta-800 bg-opacity-80 flex-col items-center rounded-lg min-w-full px-3 py-1">
        <div className="flex flex-col items-start min-w-full justify-between">
          {[GameMode.mania].includes(beatmap.mode_int) && (
            <div className="flex flex-row items-center space-x-2 min-w-full">
              <p className="text-xs text-nowrap min-w-24">Key Count:</p>
              <ProgressBar
                maxValue={10}
                value={parseInt(
                  beatmap.version.match(/\d+k/g)?.[0].replace("k", "") || "4"
                )}
                className="max-w-24"
              />
              <p> {beatmap.cs}</p>
            </div>
          )}
          {[GameMode.std, GameMode.catch].includes(beatmap.mode_int) && (
            <div className="flex flex-row items-center space-x-2 min-w-full">
              <p className="text-xs text-nowrap min-w-24">Circle Size:</p>
              <ProgressBar
                maxValue={10}
                value={beatmap.cs}
                className="max-w-24"
              />
              <p> {beatmap.cs}</p>
            </div>
          )}
          <div className="flex flex-row items-center space-x-2 min-w-full">
            <p className="text-xs text-nowrap min-w-24">HP Drain:</p>
            <ProgressBar
              maxValue={10}
              value={beatmap.drain}
              className="max-w-24"
            />
            <p> {beatmap.drain}</p>
          </div>
          <div className="flex flex-row items-center space-x-2 min-w-full">
            <p className="text-xs text-nowrap min-w-24">Accuracy:</p>
            <ProgressBar
              maxValue={10}
              value={beatmap.accuracy}
              className="max-w-24"
            />
            <p> {beatmap.accuracy}</p>
          </div>
          {[GameMode.std, GameMode.catch].includes(beatmap.mode_int) && (
            <div className="flex flex-row items-center space-x-2 min-w-full">
              <p className="text-xs text-nowrap min-w-24">Approach Rate:</p>
              <ProgressBar
                maxValue={10}
                value={beatmap.ar}
                className="max-w-24"
              />
              <p> {beatmap.ar}</p>
            </div>
          )}
        </div>
      </RoundedContent>
    </div>
  );
}
