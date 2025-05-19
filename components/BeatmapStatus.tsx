import { BeatmapStatusWeb } from "@/lib/types/api";
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
  status: BeatmapStatusWeb;
}

export const getBeatmapStatusStatusColor = (status: BeatmapStatusWeb) => {
  switch (status) {
    case BeatmapStatusWeb.LOVED:
      return "pink-500";
    case BeatmapStatusWeb.QUALIFIED:
      return "blue-500";
    case BeatmapStatusWeb.APPROVED:
      return "green-500";
    case BeatmapStatusWeb.RANKED:
      return "blue-500";
    case BeatmapStatusWeb.PENDING:
      return "yellow-500";
    case BeatmapStatusWeb.WIP:
      return "orange-500";
    case BeatmapStatusWeb.GRAVEYARD:
      return "muted-foreground";

    default:
      return "";
  }
};

export default function BeatmapStatusIcon({ status }: BeatmapStatusIconProps) {
  const color = `text-${getBeatmapStatusStatusColor(status)}`;

  switch (status) {
    case BeatmapStatusWeb.LOVED:
      return <Heart className={twMerge(color, `w-5 mx-0.5 fill-pink-500`)} />;
    case BeatmapStatusWeb.QUALIFIED:
      return <Check className={color} />;
    case BeatmapStatusWeb.APPROVED:
      return <Check className={color} />;
    case BeatmapStatusWeb.RANKED:
      return <ChevronsUp className={color} />;
    case BeatmapStatusWeb.PENDING:
      return <Clock2Icon className={color} />;
    case BeatmapStatusWeb.WIP:
      return <Construction className={color} />;
    case BeatmapStatusWeb.GRAVEYARD:
      return <CircleHelp className={color} />;
  }
}
