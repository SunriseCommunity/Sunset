import { Card, CardContent } from "@/components/ui/card";
import BeatmapStatusBadge from "@/components/BeatmapStatusBadge";
import { BeatmapSetResponse } from "@/lib/types/api";
import BeatmapDifficultyBadge from "@/components/BeatmapDifficultyBadge";
import { CollapsibleBadgeList } from "@/components/CollapsibleBadgeList";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface BeatmapSetListItemProps {
  beatmapSet: BeatmapSetResponse;
}

export function BeatmapSetListItem({ beatmapSet }: BeatmapSetListItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="h-16 w-16 flex-shrink-0 rounded-md bg-cover bg-center"
          style={{
            backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg)`,
          }}
        />
        <div className="flex-1 space-y-1">
          <div className="font-medium">{beatmapSet.title}</div>
          <div className="text-sm text-muted-foreground">
            {beatmapSet.artist} • Mapped by {beatmapSet.creator}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 w-1/3">
          <CollapsibleBadgeList
            badges={beatmapSet.beatmaps
              .sort(
                (a, b) =>
                  getBeatmapStarRating(a, a.mode) -
                  getBeatmapStarRating(b, b.mode)
              )
              .map((beatmap) => (
                <BeatmapDifficultyBadge beatmap={beatmap} />
              ))}
          />
          <BeatmapStatusBadge status={beatmapSet.status} />
        </div>
      </CardContent>
    </Card>
  );
}
