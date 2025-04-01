import PrettyButton from "@/components/General/PrettyButton";
import { isBeatmapSetFavourited } from "@/lib/actions/isBeatmapSetFavourited";
import { setBeatmapSetFavourited } from "@/lib/actions/setBeatmapSetFavourited";
import useSelf from "@/lib/hooks/useSelf";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";

interface FavouriteButtonProps {
  beatmapSet: BeatmapSet;
}

export default function FavouriteButton({ beatmapSet }: FavouriteButtonProps) {
  const beatmapSetFavouritedStatusQuery = useBeatmapSetFavouriteStatus(
    beatmapSet.id
  );
  const beatmapSetFavouritedStatus = beatmapSetFavouritedStatusQuery.data;

  const { favourited } = beatmapSetFavouritedStatus ?? { favourited: false };

  const { trigger } = useUpdateBeatmapSetFavouriteStatus(beatmapSet.id);

  const handleFavourite = async () => {
    trigger(
      { favourite: !favourited },
      {
        optimisticData: {
          favourited: !favourited,
        },
      }
    );
  };

  return (
    <PrettyButton
      onClick={handleFavourite}
      icon={
        <Heart
          className={`text-yellow-pastel
        ${favourited ? `fill-yellow-pastel` : undefined}`}
        />
      }
      className="py-2 px-3 text-sm min-h-11"
      disabled={!self}
    />
  );
}
