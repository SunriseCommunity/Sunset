import DifficultyIcon from "@/components/DifficultyIcon";
import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { BeatmapResponse } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface BeatmapDifficultyBadgeProps {
  beatmap: BeatmapResponse;
  iconPreview?: boolean;
}

export default function BeatmapDifficultyBadge({
  beatmap,
  iconPreview = false,
}: BeatmapDifficultyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={iconPreview ? "border-0 p-0.5 rounded-full m-0" : undefined}
    >
      <Tooltip
        content={
          <div className="items-center flex gap-1">
            <>
              <DifficultyIcon
                difficulty={beatmap}
                gameMode={beatmap.mode}
                className="text-sm"
              />
              ★{getBeatmapStarRating(beatmap)}
            </>
            <p className="font-normal line-clamp-1">{beatmap.version}</p>
          </div>
        }
      >
        <div className="text-xs gap-1 flex items-center">
          <DifficultyIcon
            difficulty={beatmap}
            gameMode={beatmap.mode}
            className="text-sm"
          />
          {!iconPreview && (
            <p className="font-normal line-clamp-1">{beatmap.version}</p>
          )}
        </div>
      </Tooltip>
    </Badge>
  );
}
