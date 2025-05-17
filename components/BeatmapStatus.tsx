import { BeatmapStatusSearch } from "@/lib/types/api";
import {
  Check,
  ChevronsUp,
  CircleHelp,
  Clock2Icon,
  Construction,
  Heart,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

interface BeatmapStatusIconProps {
  status: BeatmapStatusSearch;
}

export const getBeatmapStatusStatusColor = (status: BeatmapStatusSearch) => {
  switch (status) {
    case BeatmapStatusSearch.LOVED:
      return "pink-500";
    case BeatmapStatusSearch.QUALIFIED:
      return "blue-500";
    case BeatmapStatusSearch.APPROVED:
      return "green-500";
    case BeatmapStatusSearch.RANKED:
      return "blue-500";
    case BeatmapStatusSearch.PENDING:
      return "yellow-500";
    case BeatmapStatusSearch.WIP:
      return "orange-500";
    case BeatmapStatusSearch.GRAVEYARD:
      return "muted-foreground";

    default:
      return "";
  }
};

export default function BeatmapStatusIcon({ status }: BeatmapStatusIconProps) {
  const color = `text-${getBeatmapStatusStatusColor(status)}`;

  switch (status) {
    case BeatmapStatusSearch.LOVED:
      return <Heart className={twMerge(color, `w-5 mx-0.5 fill-pink-500`)} />;
    case BeatmapStatusSearch.QUALIFIED:
      return <Check className={color} />;
    case BeatmapStatusSearch.APPROVED:
      return <Check className={color} />;
    case BeatmapStatusSearch.RANKED:
      return <ChevronsUp className={color} />;
    case BeatmapStatusSearch.PENDING:
      return <Clock2Icon className={color} />;
    case BeatmapStatusSearch.WIP:
      return <Construction className={color} />;
    case BeatmapStatusSearch.GRAVEYARD:
      return <CircleHelp className={color} />;
  }
}
