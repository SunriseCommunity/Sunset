import useAudioPlayer from "@/lib/hooks/useAudioPlayer";


import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BeatmapSetResponse } from "@/lib/types/api";

interface AudioPreviewProps {
  beatmapSet: BeatmapSetResponse;
}

export default function AudioPreview({ beatmapSet }: AudioPreviewProps) {
  const { player, isPlaying, isPlayingThis, play, pause } = useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current) return;
    setIsPlayingCurrent(isPlayingThis(`${beatmapSet.id}.mp3`));
  }, [isPlaying]);

  return (
    <Button
      size="icon"
      variant="link"
      onClick={() => {
        if (isPlaying && isPlayingCurrent) {
          pause();
          return;
        }

        play(`https://b.ppy.sh/preview/${beatmapSet.id}.mp3`);
      }}
      className="text-white relative text-xs min-h-8 hover:bg-opacity-0 bg-opacity-0 px-6 py-1 min-w-full rounded-lg overflow-hidden max-w-64"
    >
      {isPlayingCurrent ? (
        <Pause className="h-8 fill-white" />
      ) : (
        <Play className="h-8 fill-white" />
      )}
    </Button>
  );
}
