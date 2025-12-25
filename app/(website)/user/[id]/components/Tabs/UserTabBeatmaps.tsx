import {
  ChartBarDecreasing,
  ChevronDown,
  Heart,
} from "lucide-react";

import BeatmapSetOverview from "@/app/(website)/user/[id]/components/BeatmapSetOverview";
import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useUserFavourites } from "@/lib/hooks/api/user/useUserFavourites";
import { useUserMostPlayed } from "@/lib/hooks/api/user/useUserMostPlayed";
import { useT } from "@/lib/i18n/utils";
import type { GameMode } from "@/lib/types/api";

import BeatmapPlayedOverview from "../BeatmapPlayedOverview";

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
  } = useUserMostPlayed(userId, gameMode, pageLimitMostPlayed);

  const isLoadingMoreMostPlayed
    = isLoadingMostPlayed
      || (mostPlayedSize > 0
        && mostPlayedData
        && mostPlayedData[mostPlayedSize - 1] === undefined);

  const mostPlayed = mostPlayedData?.flatMap(item => item.most_played);
  const totalCountMostPlayed = mostPlayedData?.find(
    item => item.total_count !== undefined,
  )?.total_count;

  const handleShowMoreMostPlayed = () => {
    setMostPlayedSize(mostPlayedSize + 1);
  };

  const {
    data: favouritesData,
    setSize: setFavouritesSize,
    size: favouritesSize,
    isLoading: isLoadingFavourites,
  } = useUserFavourites(userId, gameMode, pageLimitFavourites);

  const isLoadingMoreFavourites
    = isLoadingFavourites
      || (favouritesSize > 0
        && favouritesData
        && favouritesData[favouritesSize - 1] === undefined);

  const favourites = favouritesData?.flatMap(item => item.sets);
  const totalCountFavourites = favouritesData?.find(
    item => item.total_count !== undefined,
  )?.total_count;

  const handleShowMoreFavourites = () => {
    setFavouritesSize(favouritesSize + 1);
  };

  const t = useT("pages.user.components.beatmapsTab");

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text={t("mostPlayed")}
        icon={<ChartBarDecreasing />}
        counter={
          totalCountMostPlayed ?? 0 > 0 ? totalCountMostPlayed : undefined
        }
      />
      <RoundedContent className="mb-6 h-fit max-h-none min-h-60">
        {!mostPlayed && isLoadingMoreMostPlayed && (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        )}

        {totalCountMostPlayed === 0 && (
          <ContentNotExist text={t("noMostPlayed")} />
        )}

        {typeof totalCountMostPlayed === "number" && mostPlayed !== undefined && (
          <>
            {mostPlayed.map(beatmap => (
              <div key={`beatmap-most-played-${beatmap.id}`} className="mb-2">
                <BeatmapPlayedOverview
                  beatmap={beatmap}
                  playcount={beatmap.play_count}
                />
              </div>
            ))}
            {mostPlayed.length < totalCountMostPlayed && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleShowMoreMostPlayed}
                  className="flex w-full items-center justify-center md:w-1/2"
                  variant="secondary"
                  isLoading={isLoadingMoreMostPlayed}
                >
                  <ChevronDown /> {t("showMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </RoundedContent>

      <PrettyHeader
        text={t("favouriteBeatmaps")}
        icon={<Heart />}
        counter={
          totalCountFavourites && totalCountFavourites > 0
            ? totalCountFavourites
            : undefined
        }
      />
      <RoundedContent className="h-fit max-h-none min-h-60">
        {!favourites && isLoadingMoreFavourites && (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        )}

        {totalCountFavourites === 0 && (
          <ContentNotExist text={t("noFavourites")} />
        )}

        {typeof totalCountFavourites === "number" && favourites !== undefined && (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {favourites.map(beatmapSet => (
                <div
                  key={`beatmap-set-favourited-${beatmapSet.id}`}
                  className="mb-2"
                >
                  <BeatmapSetOverview beatmapSet={beatmapSet} />
                </div>
              ))}
            </div>
            {favourites.length < totalCountFavourites && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleShowMoreFavourites}
                  className="flex w-full items-center justify-center md:w-1/2"
                  isLoading={isLoadingMoreFavourites}
                  variant="secondary"
                >
                  <ChevronDown />
                  {t("showMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </RoundedContent>
    </div>
  );
}
