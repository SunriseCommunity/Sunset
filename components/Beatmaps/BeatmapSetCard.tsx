import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import BeatmapDifficultyBadge from "@/components/BeatmapDifficultyBadge";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import { CollapsibleBadgeList } from "@/components/CollapsibleBadgeList";
import PrettyDate from "@/components/General/PrettyDate";
import ProgressBar from "@/components/ProgressBar";
import { BanchoSmallUserElement } from "@/components/SmallUserElement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface BeatmapSetCardProps {
  beatmapSet: BeatmapSetResponse;
}

export function BeatmapSetCard({ beatmapSet }: BeatmapSetCardProps) {
  const t = useT("components.beatmapSetCard");
  const pathname = usePathname();

  const { player, isPlaying, isPlayingThis, currentTimestamp }
    = useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current)
      return;

    setIsPlayingCurrent(isPlayingThis(`${beatmapSet.id}.mp3`));
  }, [beatmapSet.id, isPlaying, isPlayingThis, player]);

  return (
    <Card className="flex h-full flex-col overflow-hidden" key={beatmapSet.id}>
      <div
        className="h-32 bg-cover bg-center "
        style={{
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg)`,
        }}
      >
        <div className="relative flex size-full flex-col justify-between bg-gradient-to-t from-black/90 to-black/30 p-3">
          <div className="flex justify-start">
            <div className="rounded-lg border bg-card p-0.5 ">
              <BeatmapStatusIcon status={beatmapSet.status} />
            </div>
          </div>
          <div className="flex">
            <Link
              href={`${pathname.includes("/admin/") ? "/admin" : ""
                 }/beatmapsets/${beatmapSet.id}`}
              className="flex-grow"
            >
              <h3 className="line-clamp-2 font-semibold text-white">
                {beatmapSet.title}
              </h3>
              <p className="line-clamp-1 text-sm font-light text-gray-300">
                {beatmapSet.artist}
              </p>
            </Link>
            <AudioPreview
              beatmapSet={beatmapSet}
              className="mt-auto w-fit min-w-fit max-w-fit p-1"
            />
          </div>

          <ProgressBar
            value={currentTimestamp}
            maxValue={player.current?.duration || 10}
            className={twMerge(
              "absolute bottom-0 left-0 w-full h-0.5",
              !isPlayingCurrent
              || !isPlaying
              || currentTimestamp === player.current?.duration
              || currentTimestamp === 0
                ? "hidden"
                : undefined,
            )}
          />
        </div>
      </div>
      <CardContent className="span-y-2 flex flex-grow flex-col p-3">
        <div className="h-full ">
          <CollapsibleBadgeList
            badges={beatmapSet.beatmaps
              .sort((a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b))
              .sort((a, b) => a.mode_int - b.mode_int)
              .map(beatmap => (
                <BeatmapDifficultyBadge key={`beatmap-difficulty-badge-${beatmap.id}`} beatmap={beatmap} />
              ))}
          />
        </div>
        <br />
        <div className="flex items-center justify-between gap-1 text-xs">
          <div>
            <p className="font-light">{t("submittedBy")} </p>
            <p className=" font-light">{t("submittedOn")} </p>
          </div>

          <div>
            <BanchoSmallUserElement
              user_id={beatmapSet.creator_id}
              username={beatmapSet.creator}
            />

            <PrettyDate time={beatmapSet.submitted_date} className="" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-3">
        <Button className="w-full" variant="outline" size="sm" asChild>
          <Link
            href={`${pathname.includes("/admin/") ? "/admin" : ""
               }/beatmapsets/${beatmapSet.id}`}
          >
            <ExternalLink className="mr-1 size-3" />
            {t("view")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
