import { Button } from "@/components/ui/button";
import { BeatmapSetResponse } from "@/lib/types/api";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface DownloadButtonsProps {
  beatmapSet: BeatmapSetResponse;
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
