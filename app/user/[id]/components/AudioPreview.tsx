import PrettyButton from "@/components/General/PrettyButton";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { BeatmapSet } from "@/lib/types/BeatmapSet";

import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface AudioPreviewProps {
  beatmapSet: BeatmapSet;
}

export default function AudioPreview({ beatmapSet }: AudioPreviewProps) {
  const { player, isPlaying, isPlayingThis, play, pause } = useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current) return;
    setIsPlayingCurrent(isPlayingThis(`${beatmapSet.id}.mp3`));
  }, [isPlaying]);

  return (
    <PrettyButton
      onClick={() => {
        if (isPlaying && isPlayingCurrent) {
          pause();
          return;
        }

        play(`https://b.ppy.sh/preview/${beatmapSet.id}.mp3`);
      }}
      icon={
        isPlayingCurrent ? (
          <Pause className="h-8 fill-white" />
        ) : (
          <Play className="h-8 fill-white" />
        )
      }
      className="text-white relative text-xs min-h-8 hover:bg-opacity-0 bg-opacity-0 px-6 py-1 min-w-full rounded-lg overflow-hidden max-w-64"
    />
  );
}
