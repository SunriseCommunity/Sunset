import { getBeatmapStatusStatusColor } from "@/components/BeatmapStatus";
import { Badge } from "@/components/ui/badge";
import { BeatmapStatusSearch } from "@/lib/types/api";

import { twMerge } from "tailwind-merge";

interface BeatmapStatusBadgeProps {
  status: BeatmapStatusSearch;
}

export default function BeatmapStatusBadge({
  status,
}: BeatmapStatusBadgeProps) {
  const color = getBeatmapStatusStatusColor(status);

  return (
    <Badge
      variant="outline"
      className={twMerge(
        "font-normal",
        `bg-${color}/20 text-${color} hover:bg-${color}/20 hover:text-${color}`
      )}
    >
      {status}
    </Badge>
  );
}
