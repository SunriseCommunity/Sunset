import DifficultyIcon from "@/components/DifficultyIcon";
import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { BeatmapResponse } from "@/lib/types/api";

interface BeatmapDifficultyBadgeProps {
  beatmap: BeatmapResponse;
}

export default function BeatmapDifficultyBadge({
  beatmap,
}: BeatmapDifficultyBadgeProps) {
  return (
    <Badge variant="outline" className="text-xs gap-1">
      <DifficultyIcon
        difficulty={beatmap}
        gameMode={beatmap.mode}
        className="text-sm"
      />
      <Tooltip
        content={beatmap.version}
        children={<p className="font-normal line-clamp-1">{beatmap.version}</p>}
      ></Tooltip>
    </Badge>
  );
}
