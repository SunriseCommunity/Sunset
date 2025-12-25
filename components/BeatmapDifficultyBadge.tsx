import DifficultyIcon from "@/components/DifficultyIcon";
import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import type { BeatmapResponse } from "@/lib/types/api";
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
      className={iconPreview ? "m-0 rounded-full border-0 p-0.5" : undefined}
    >
      <Tooltip
        content={(
          <div className="flex items-center gap-1">
            <>
              <DifficultyIcon
                difficulty={beatmap}
                gameMode={beatmap.mode}
                className="text-sm"
              />
              ★
              {getBeatmapStarRating(beatmap)}
            </>
            <p className="line-clamp-1 font-normal">{beatmap.version}</p>
          </div>
        )}
      >
        <div className="flex items-center gap-1 text-xs">
          <DifficultyIcon
            difficulty={beatmap}
            gameMode={beatmap.mode}
            className="text-sm"
          />
          {!iconPreview && (
            <p className="line-clamp-1 font-normal">{beatmap.version}</p>
          )}
        </div>
      </Tooltip>
    </Badge>
  );
}
