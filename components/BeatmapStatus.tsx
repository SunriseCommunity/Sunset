import { BeatmapStatus } from "@/lib/hooks/api/beatmap/types";
import {
  Check,
  ChevronsUp,
  CircleHelp,
  Clock2Icon,
  Construction,
  Heart,
} from "lucide-react";

interface BeatmapStatusIconProps {
  status: BeatmapStatus;
}

export default function BeatmapStatusIcon({ status }: BeatmapStatusIconProps) {
  switch (status) {
    case BeatmapStatus.Loved:
      return <Heart className="text-pink-500 w-5 mx-0.5 fill-pink-500" />;
    case BeatmapStatus.Qualified:
      return <Check className="text-blue-500" />;
    case BeatmapStatus.Approved:
      return <Check className="text-green-500" />;
    case BeatmapStatus.Ranked:
      return <ChevronsUp className="text-blue-500" />;
    case BeatmapStatus.Pending:
      return <Clock2Icon className="text-yellow-500" />;
    case BeatmapStatus.WIP:
      return <Construction className="text-orange-500" />;
    case BeatmapStatus.Graveyard:
      return <CircleHelp className="text-gray-200" />;
  }
}
