import { Button } from "@/components/ui/button";
import { BeatmapSetResponse } from "@/lib/types/api";
import { Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DownloadButtonsProps {
  beatmapSet: BeatmapSetResponse;
  vairant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "accent"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
}

export default function DownloadButtons({
  beatmapSet,
  vairant = "secondary",
  size = "xl",
}: DownloadButtonsProps) {
  const router = useRouter();

  return (
    <>
      <Button variant={vairant} size={size} disabled={!self} asChild>
        <Link
          href={`https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}`}
        >
          <Download />
          <div className="text-start">
            Download
            {beatmapSet.video ? (
              <p className="text-xs font-light">with Video</p>
            ) : undefined}
          </div>
        </Link>
      </Button>

      {beatmapSet.video && (
        <Button variant={vairant} size={size} disabled={!self} asChild>
          <Link
            href={`https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}?noVideo=1`}
          >
            <Download />
            <div className="text-start">
              Download
              <p className="text-xs font-light">without Video</p>
            </div>
          </Link>
        </Button>
      )}

      <Button variant={vairant} size={size} disabled={!self} asChild>
        <Link href={`osu://dl/${beatmapSet.id}`}>
          <Download />
          osu!direct
        </Link>
      </Button>
    </>
  );
}
