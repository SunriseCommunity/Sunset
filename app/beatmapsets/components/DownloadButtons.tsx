import PrettyButton from "@/components/General/PrettyButton";
import { Button } from "@/components/ui/button";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface DownloadButtonsProps {
  beatmapSet: BeatmapSet;
}

export default function DownloadButtons({ beatmapSet }: DownloadButtonsProps) {
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() =>
          router.push(
            `https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}`
          )
        }
        variant="secondary"
        size="xl"
        disabled={!self}
      >
        <Download />
        <div className="text-start">
          Download
          {beatmapSet.video ? (
            <p className="text-xs font-light">with Video</p>
          ) : undefined}
        </div>
      </Button>

      {beatmapSet.video && (
        <Button
          onClick={() =>
            router.push(
              `https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}?noVideo=1`
            )
          }
          variant="secondary"
          size="xl"
          disabled={!self}
        >
          <Download />
          <div className="text-start">
            Download
            <p className="text-xs font-light">without Video</p>
          </div>
        </Button>
      )}
      <Button
        onClick={() => router.push(`osu://dl/${beatmapSet.id}`)}
        variant="secondary"
        size="xl"
        disabled={!self}
      >
        <Download />
        osu!direct
      </Button>
    </>
  );
}
