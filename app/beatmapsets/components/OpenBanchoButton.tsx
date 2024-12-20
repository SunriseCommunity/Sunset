import PrettyButton from "@/components/General/PrettyButton";
import { BeatmapSet } from "@/lib/types/BeatmapSet";
import { DoorOpenIcon } from "lucide-react";
import { useState } from "react";

interface OpenBanchoButtonProps {
  beatmapSet: BeatmapSet;
}

export default function OpenBanchoButton({
  beatmapSet,
}: OpenBanchoButtonProps) {
  const [includeOpenBanchoButton] = useState(() => {
    return localStorage.getItem("includeOpenBanchoButton") || "false";
  });

  return includeOpenBanchoButton === "true" ? (
    <PrettyButton
      onClick={() =>
        window.open(`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`)
      }
      icon={<DoorOpenIcon />}
      className="py-2 px-3 text-xs min-h-11"
      disabled={!self}
      text="Open on Bancho"
    />
  ) : null;
}
