import { BeatmapStatusSearch } from "@/lib/types/api";
import {
  Check,
  ChevronsUp,
  CircleHelp,
  Clock2Icon,
  Construction,
  Heart,
} from "lucide-react";

interface BeatmapStatusIconProps {
  status: BeatmapStatusSearch;
}

export default function BeatmapStatusIcon({ status }: BeatmapStatusIconProps) {
  switch (status) {
    case BeatmapStatusSearch.LOVED:
      return <Heart className="text-pink-500 w-5 mx-0.5 fill-pink-500" />;
    case BeatmapStatusSearch.QUALIFIED:
      return <Check className="text-blue-500" />;
    case BeatmapStatusSearch.APPROVED:
      return <Check className="text-green-500" />;
    case BeatmapStatusSearch.RANKED:
      return <ChevronsUp className="text-blue-500" />;
    case BeatmapStatusSearch.PENDING:
      return <Clock2Icon className="text-yellow-500" />;
    case BeatmapStatusSearch.WIP:
      return <Construction className="text-orange-500" />;
    case BeatmapStatusSearch.GRAVEYARD:
      return <CircleHelp className="text-muted-foreground" />;
  }
}
