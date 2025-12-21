import { Button } from "@/components/ui/button";
import { BeatmapSetResponse } from "@/lib/types/api";
import { Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/utils";
import useSelf from "@/lib/hooks/useSelf";

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
  const t = useT("pages.beatmapsets.components.downloadButtons");
  const { self } = useSelf();
  const router = useRouter();

  return (
    <>
      <Button variant={vairant} size={size} disabled={!self} asChild>
        <Link
          href={`https://osu.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/d/${beatmapSet.id}`}
        >
          <Download />
          <div className="text-start">
            {t("download")}
            {beatmapSet.video ? (
              <p className="text-xs font-light">{t("withVideo")}</p>
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
              {t("download")}
              <p className="text-xs font-light">{t("withoutVideo")}</p>
            </div>
          </Link>
        </Button>
      )}

      <Button variant={vairant} size={size} disabled={!self} asChild>
        <Link href={`osu://dl/${beatmapSet.id}`}>
          <Download />
          {t("osuDirect")}
        </Link>
      </Button>
    </>
  );
}
