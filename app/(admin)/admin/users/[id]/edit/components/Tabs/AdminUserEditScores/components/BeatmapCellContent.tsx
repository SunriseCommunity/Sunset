"use client";

import Image from "next/image";
import Link from "next/link";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import PrettyDate from "@/components/General/PrettyDate";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { BeatmapStatusWeb } from "@/lib/types/api";

export default function BeatmapCellContent({
  beatmapId,
  whenSubmitted,
}: {
  beatmapId: number;
  whenSubmitted: string;
}) {
  const { data: beatmap } = useBeatmap(beatmapId);

  return (
    <div className="flex min-w-0 max-w-[300px] items-start gap-2">
      {beatmap
        ? (
            <Image
              src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/list@2x.jpg`}
              alt={`${beatmap.artist} - ${beatmap.title}`}
              width={42}
              height={42}
              className="h-10 w-[42px] shrink-0 rounded object-cover"
            />
          )
        : <div className="h-10 w-[42px] shrink-0 rounded bg-muted" />}

      <div className="min-w-0">
        {beatmap?.status && beatmap.status !== BeatmapStatusWeb.UNKNOWN && (
          <span className="mr-1 inline-flex align-middle">
            <BeatmapStatusIcon status={beatmap.status} />
          </span>
        )}
        {beatmap
          ? (
              <Link
                href={`/beatmaps/${beatmap.id}`}
                className="line-clamp-2 inline text-xs leading-4 text-primary hover:underline"
                title={`${beatmap.artist} - ${beatmap.title}`}
              >
                {beatmap.artist} - {beatmap.title}
              </Link>
            )
          : (
              <span className="line-clamp-2 block text-xs leading-4 text-muted-foreground">
                {`Beatmap #${beatmapId}`}
              </span>
            )}

        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span>Date played:</span>
          <PrettyDate time={whenSubmitted} className="inline" withTime={true} />
        </div>
      </div>
    </div>
  );
}
