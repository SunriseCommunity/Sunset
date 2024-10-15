import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyButton from "@/components/General/PrettyButton";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { GameMode } from "@/lib/types/GameMode";
import { ChartBarDecreasing, ChevronDown, Heart, History } from "lucide-react";
import { useEffect, useState } from "react";
import BeatmapPlayedOverview from "../BeatmapOverview";
import { PlayedBeatmap } from "@/lib/types/PlayedBeatmap";
import { getUserMostPlayed } from "@/lib/actions/getUserMostPlayed";
import { Beatmap } from "@/lib/types/Beatmap";
import { getUserFavourites } from "@/lib/actions/getUserFavourites";
import { BeatmapSet } from "@/lib/types/BeatmapSet";

interface UserTabBeatmapsProps {
  userId: number;
  gameMode: GameMode;
}

const pageLimit = 5;

export default function UserTabBeatmaps({
  userId,
  gameMode,
}: UserTabBeatmapsProps) {
  const [isMostPlayedLoading, setMostPlayedIsLoading] = useState(false);
  const [playedBeatmapsObject, setPlayedBeatmapsObject] = useState<{
    most_played: PlayedBeatmap[];
    total_count: number;
  }>({ most_played: [], total_count: -1 });
  const [mostPlayedPage, setMostPlayedPage] = useState(0);

  const [isFavouritesLoading, setFavouritesIsLoading] = useState(false);
  const [favouritesObject, setFavouritesObject] = useState<{
    sets: BeatmapSet[];
    total_count: number;
  }>({ sets: [], total_count: -1 });
  const [favouritesPage, setFavouritesPage] = useState(0);

  useEffect(() => {
    if (isMostPlayedLoading) return;

    setMostPlayedIsLoading(true);

    getUserMostPlayed(userId, gameMode, mostPlayedPage, pageLimit).then(
      (res) => {
        if (res.error) {
          setMostPlayedIsLoading(false);
          return;
        }

        setPlayedBeatmapsObject({
          most_played: [
            ...playedBeatmapsObject.most_played,
            ...res.data!.most_played,
          ],
          total_count: res.data!.total_count,
        });

        setMostPlayedIsLoading(false);
      }
    );
  }, [mostPlayedPage]);

  useEffect(() => {
    if (isFavouritesLoading) return;

    setFavouritesIsLoading(true);

    getUserFavourites(userId, mostPlayedPage, pageLimit).then((res) => {
      if (res.error) {
        setFavouritesIsLoading(false);
        return;
      }

      setFavouritesObject({
        sets: [...favouritesObject.sets, ...res.data!.sets],
        total_count: res.data!.total_count,
      });

      setFavouritesIsLoading(false);
    });
  }, [mostPlayedPage]);

  const handleShowMoreMostPlayed = () => {
    setMostPlayedPage(mostPlayedPage + 1);
  };

  const handleShowMoreFavourites = () => {
    setFavouritesPage(favouritesPage + 1);
  };

  const { most_played, total_count } = playedBeatmapsObject;
  const { sets, total_count: total_count_favourites } = favouritesObject;

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text="Most played"
        icon={<ChartBarDecreasing />}
        counter={total_count > 0 ? total_count : undefined}
      />
      <RoundedContent className="min-h-60 h-fit max-h-none mb-6">
        {most_played.length === 0 &&
          (isMostPlayedLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : (
            <ContentNotExist text="User has no most played beatmaps" />
          ))}

        {most_played.map((beatmap) => (
          <div key={`beatmap-most-played-${beatmap.id}`} className="mb-2">
            <BeatmapPlayedOverview
              beatmap={beatmap}
              playcount={beatmap.play_count}
            />
          </div>
        ))}

        {most_played.length < total_count && (
          <div className="flex justify-center mt-4">
            <PrettyButton
              text="Show more"
              onClick={handleShowMoreMostPlayed}
              icon={<ChevronDown />}
              className="w-full md:w-1/2 flex items-center justify-center"
              isLoading={isMostPlayedLoading}
            />
          </div>
        )}
      </RoundedContent>

      <PrettyHeader
        text="Favourite Beatmaps"
        icon={<Heart />}
        counter={
          total_count_favourites > 0 ? total_count_favourites : undefined
        }
      />
      <RoundedContent className="min-h-60 h-fit max-h-none">
        {sets.length === 0 &&
          (isFavouritesLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : (
            <ContentNotExist text="User has no favourite beatmaps" />
          ))}

        {sets.map((set) => (
          <div key={`beatmap-favourite-${set.id}`} className="mb-2">
            {set.title}
            {/* TODO: Add beatmap set preview */}
          </div>
        ))}

        {sets.length < total_count_favourites && (
          <div className="flex justify-center mt-4">
            <PrettyButton
              text="Show more"
              onClick={handleShowMoreFavourites}
              icon={<ChevronDown />}
              className="w-full md:w-1/2 flex items-center justify-center"
              isLoading={isFavouritesLoading}
            />
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
