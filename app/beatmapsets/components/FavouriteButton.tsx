import PrettyButton from "@/components/General/PrettyButton";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { Heart } from "lucide-react";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import useSelf from "@/lib/hooks/useSelf";

interface FavouriteButtonProps {
  beatmapSet: BeatmapSet;
}

export default function FavouriteButton({ beatmapSet }: FavouriteButtonProps) {
  const { self } = useSelf();

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
    <Button
      onClick={handleFavourite}
      disabled={!self}
      size="xl"
      variant="secondary"
    >
      <Heart
        className={twMerge(
          `text-secondary-foreground`,
          favourited ? `fill-secondary-foreground` : ""
        )}
      />
    </Button>
  );
}
