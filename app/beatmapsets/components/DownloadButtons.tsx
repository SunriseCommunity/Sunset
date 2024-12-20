import PrettyButton from "@/components/General/PrettyButton";
import { BeatmapSet } from "@/lib/types/BeatmapSet";
import { Download } from "lucide-react";

interface DownloadButtonsProps {
  beatmapSet: BeatmapSet;
}

export default function DownloadButtons({ beatmapSet }: DownloadButtonsProps) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <PrettyButton
        onClick={() =>
          (window.location.href = `https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}`)
        }
        text="Download"
        bottomText={beatmapSet.video ? "with Video" : undefined}
        icon={<Download />}
        className="p-2 text-sm min-h-11 "
        disabled={!self}
      />
      {beatmapSet.video && (
        <PrettyButton
          onClick={() =>
            (window.location.href = `https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}?noVideo=1`)
          }
          text="Download"
          bottomText="without Video"
          icon={<Download />}
          className="p-2 text-sm min-h-11"
          disabled={!self}
        />
      )}
      <PrettyButton
        onClick={() => (window.location.href = `osu://dl/${beatmapSet.id}`)}
        text="osu!direct"
        icon={<Download />}
        className="p-2 text-sm min-h-11 "
        disabled={!self}
      />
    </div>
  );
}
