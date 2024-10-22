import PrettyButton from "@/components/General/PrettyButton";
import { isBeatmapSetFavourited } from "@/lib/actions/isBeatmapSetFavourited";
import { setBeatmapSetFavourited } from "@/lib/actions/setBeatmapSetFavourited";
import useSelf from "@/lib/hooks/useSelf";
import { BeatmapSet } from "@/lib/types/BeatmapSet";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FavouriteButtonProps {
  beatmapSet: BeatmapSet;
}

export default function FavouriteButton({ beatmapSet }: FavouriteButtonProps) {
  const [isFavourited, setIsFavourited] = useState(false);

  const { self } = useSelf();

  useEffect(() => {
    if (!self) return;

    const fetchFavourite = async () => {
      const { data, error } = await isBeatmapSetFavourited(beatmapSet.id);
      if (error) {
        alert(error);
        return;
      }

      setIsFavourited(data!.favourited);
    };

    fetchFavourite();
  }, [self, beatmapSet.id]);

  const handleFavourite = async () => {
    if (!self) return;

    await setBeatmapSetFavourited(beatmapSet.id, !isFavourited);

    setIsFavourited(!isFavourited);
  };

  return (
    <PrettyButton
      onClick={handleFavourite}
      icon={
        <Heart
          className={`text-yellow-pastel
        ${isFavourited ? `fill-yellow-pastel` : undefined}`}
        />
      }
      className="py-2 px-3 text-sm min-h-11"
      disabled={!self}
    />
  );
}
