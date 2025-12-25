import { twMerge } from "tailwind-merge";

import { getBeatmapStatusStatusColor } from "@/components/BeatmapStatus";
import { Badge } from "@/components/ui/badge";
import type { BeatmapStatusWeb } from "@/lib/types/api";

interface BeatmapStatusBadgeProps {
  status: BeatmapStatusWeb;
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
        `bg-${color}/20 text-${color} hover:bg-${color}/20 hover:text-${color}`,
      )}
    >
      {status}
    </Badge>
  );
}
