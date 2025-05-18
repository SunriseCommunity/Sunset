import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import BeatmapStatusBadge from "@/components/BeatmapStatusBadge";
import { BeatmapSetResponse } from "@/lib/types/api";
import BeatmapDifficultyBadge from "@/components/BeatmapDifficultyBadge";
import { CollapsibleBadgeList } from "@/components/CollapsibleBadgeList";
import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import ProgressBar from "@/components/ProgressBar";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { BanchoSmallUserElement } from "@/components/SmallUserElement";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import PrettyDate from "@/components/General/PrettyDate";
import { usePathname } from "next/navigation";

interface BeatmapSetCardProps {
  beatmapSet: BeatmapSetResponse;
}

export function BeatmapSetCard({ beatmapSet }: BeatmapSetCardProps) {
  const pathname = usePathname();

  const { player, isPlaying, isPlayingThis, currentTimestamp } =
    useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!player.current) return;

    setIsPlayingCurrent(isPlayingThis(`${beatmapSet.id}.mp3`));
  }, [isPlaying]);

  return (
    <Card className="flex flex-col overflow-hidden h-full" key={beatmapSet.id}>
      <div
        className="h-32 bg-cover bg-center "
        style={{
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg)`,
        }}
      >
        <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-t from-black/90 to-black/30 p-3">
          <div className="flex justify-start">
            <div className="bg-card rounded-lg p-0.5 border ">
              <BeatmapStatusIcon status={beatmapSet.status} />
            </div>
          </div>
          <div className="flex">
            <Link href={`/beatmapsets/${beatmapSet.id}`} className="flex-grow">
              <h3 className="line-clamp-2 font-semibold text-white">
                {beatmapSet.title}
              </h3>
              <p className="line-clamp-1 font-light text-sm text-gray-300">
                {beatmapSet.artist}
              </p>
            </Link>
            <AudioPreview
              beatmapSet={beatmapSet}
              className="p-1 max-w-fit min-w-fit w-fit mt-auto"
            />
          </div>

          <ProgressBar
            value={currentTimestamp}
            maxValue={player.current?.duration || 10}
            className={twMerge(
              "absolute bottom-0 left-0 w-full h-0.5",
              !isPlayingCurrent ||
                !isPlaying ||
                currentTimestamp === player.current?.duration ||
                currentTimestamp === 0
                ? "hidden"
                : undefined
            )}
          />
        </div>
      </div>
      <CardContent className="p-3 flex flex-col flex-grow span-y-2">
        <div className="h-full ">
          <CollapsibleBadgeList
            badges={beatmapSet.beatmaps
              .sort(
                (a, b) =>
                  getBeatmapStarRating(a, a.mode) -
                  getBeatmapStarRating(b, b.mode)
              )
              .map((beatmap, i) => (
                <BeatmapDifficultyBadge key={i} beatmap={beatmap} />
              ))}
          />
        </div>
        <br />
        <div className="flex items-center gap-1 text-xs justify-between">
          <div>
            <p className="font-light">submitted by </p>
            <p className=" font-light">submitted on </p>
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
            href={
              (pathname.includes("/admin/") ? "/admin" : "") +
              `/beatmapsets/${beatmapSet.id}`
            }
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
