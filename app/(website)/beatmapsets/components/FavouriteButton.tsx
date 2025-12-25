import { Heart } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import {
  useBeatmapSetFavouriteStatus,
  useUpdateBeatmapSetFavouriteStatus,
} from "@/lib/hooks/api/beatmap/useBeatmapSetFavouriteStatus";
import useSelf from "@/lib/hooks/useSelf";
import type { BeatmapSetResponse } from "@/lib/types/api";

interface FavouriteButtonProps {
  beatmapSet: BeatmapSetResponse;
}

export default function FavouriteButton({ beatmapSet }: FavouriteButtonProps) {
  const { self } = useSelf();

  const beatmapSetFavouritedStatusQuery = useBeatmapSetFavouriteStatus(
    beatmapSet.id,
  );
  const beatmapSetFavouritedStatus = beatmapSetFavouritedStatusQuery.data;

  const { favourited } = beatmapSetFavouritedStatus ?? { favourited: false };

  const { trigger } = useUpdateBeatmapSetFavouriteStatus(beatmapSet.id);

  const handleFavourite = async () => {
    trigger(
      { favourited: !favourited },
      {
        optimisticData: {
          favourited: !favourited,
        },
      },
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
          favourited ? `fill-secondary-foreground` : "",
        )}
      />
    </Button>
  );
}
