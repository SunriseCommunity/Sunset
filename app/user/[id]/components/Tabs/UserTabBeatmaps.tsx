import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyButton from "@/components/General/PrettyButton";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { GameMode } from "@/lib/hooks/api/types";
import { ChartBarDecreasing, ChevronDown, Heart, History } from "lucide-react";
import BeatmapPlayedOverview from "../BeatmapPlayedOverview";
import BeatmapSetOverview from "@/app/user/[id]/components/BeatmapSetOverview";
import { useUserMostPlayed } from "@/lib/hooks/api/user/useUserMostPlayed";
import { useUserFavourites } from "@/lib/hooks/api/user/useUserFavourites";

interface UserTabBeatmapsProps {
  userId: number;
  gameMode: GameMode;
}

const pageLimitMostPlayed = 5;
const pageLimitFavourites = 6;

export default function UserTabBeatmaps({
  userId,
  gameMode,
}: UserTabBeatmapsProps) {
  const {
    data: mostPlayedData,
    setSize: setMostPlayedSize,
    size: mostPlayedSize,
    isLoading: isLoadingMostPlayed,
    isValidating: isValidatingMostPlayed,
  } = useUserMostPlayed(userId, gameMode, pageLimitMostPlayed);

  const mostPlayed = mostPlayedData?.flatMap((item) => item.most_played);
  const totalCountMostPlayed = mostPlayedData?.find(
    (item) => item.total_count !== undefined
  )?.total_count;

  const handleShowMoreMostPlayed = () => {
    setMostPlayedSize(mostPlayedSize + 1);
  };

  const {
    data: favouritesData,
    setSize: setFavouritesSize,
    size: favouritesSize,
    isLoading: isLoadingFavourites,
    isValidating: isValidatingFavourites,
  } = useUserFavourites(userId, gameMode, pageLimitFavourites);

  const favourites = favouritesData?.flatMap((item) => item.sets);
  const totalCountFavourites = favouritesData?.find(
    (item) => item.total_count !== undefined
  )?.total_count;

  const handleShowMoreFavourites = () => {
    setFavouritesSize(favouritesSize + 1);
  };

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text="Most played"
        icon={<ChartBarDecreasing />}
        counter={
          totalCountMostPlayed ?? 0 > 0 ? totalCountMostPlayed : undefined
        }
      />
      <RoundedContent className="min-h-60 h-fit max-h-none mb-6">
        {!mostPlayed && (isLoadingMostPlayed || isValidatingMostPlayed) && (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        )}

        {totalCountMostPlayed === 0 && (
          <ContentNotExist text="User has no most played beatmaps" />
        )}

        {totalCountMostPlayed != undefined && mostPlayed != undefined && (
          <>
            {mostPlayed.map((beatmap) => (
              <div key={`beatmap-most-played-${beatmap.id}`} className="mb-2">
                <BeatmapPlayedOverview
                  beatmap={beatmap}
                  playcount={beatmap.play_count}
                />
              </div>
            ))}
            {mostPlayed.length < totalCountMostPlayed && (
              <div className="flex justify-center mt-4">
                <PrettyButton
                  text="Show more"
                  onClick={handleShowMoreMostPlayed}
                  icon={<ChevronDown />}
                  className="w-full md:w-1/2 flex items-center justify-center"
                  isLoading={isLoadingMostPlayed || isValidatingMostPlayed}
                />
              </div>
            )}
          </>
        )}
      </RoundedContent>

      <PrettyHeader
        text="Favourite Beatmaps"
        icon={<Heart />}
        counter={
          totalCountFavourites && totalCountFavourites > 0
            ? totalCountFavourites
            : undefined
        }
      />
      <RoundedContent className="min-h-60 h-fit max-h-none">
        {!favourites && (isLoadingFavourites || isValidatingFavourites) && (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        )}

        {totalCountFavourites === 0 && (
          <ContentNotExist text="User has no favourite beatmaps" />
        )}

        {totalCountFavourites != undefined && favourites != undefined && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {favourites.map((beatmapSet) => (
                <div
                  key={`beatmap-set-favourited-${beatmapSet.id}`}
                  className="mb-2"
                >
                  <BeatmapSetOverview beatmapSet={beatmapSet} />
                </div>
              ))}
            </div>
            {favourites.length < totalCountFavourites && (
              <div className="flex justify-center mt-4">
                <PrettyButton
                  text="Show more"
                  onClick={handleShowMoreFavourites}
                  icon={<ChevronDown />}
                  className="w-full md:w-1/2 flex items-center justify-center"
                  isLoading={isLoadingFavourites || isValidatingFavourites}
                />
              </div>
            )}
          </>
        )}
      </RoundedContent>
    </div>
  );
}
