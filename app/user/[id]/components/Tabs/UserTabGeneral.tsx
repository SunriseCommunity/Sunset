import UserStatsChart from "@/app/user/[id]/components/UserScoresChart";
import UserScoresChart from "@/app/user/[id]/components/UserScoresChart";
import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import SkeletonLoading from "@/components/SkeletonLoading";
import { Tooltip } from "@/components/Tooltip";
import { getUserGraph } from "@/lib/actions/getUserGraph";
import { GameMode } from "@/lib/types/GameMode";
import { StatsSnapshot } from "@/lib/types/StatsSnapshot";
import { User } from "@/lib/types/User";
import { UserStats } from "@/lib/types/UserStats";
import NumberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import { FolderKanbanIcon, Trophy, User2 } from "lucide-react";
import { useEffect, useState } from "react";

interface UserTabGeneralProps {
  user: User;
  stats: UserStats | null;
  gameMode: GameMode;
}

export default function UserTabGeneral({
  user,
  stats,
  gameMode,
}: UserTabGeneralProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Deprecated: will be replaced by snapshot system
  const [graph, setGraph] = useState<{
    snapshots: StatsSnapshot[];
    total_count: number;
  }>({ snapshots: [], total_count: 0 });

  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);

    getUserGraph(user.user_id, gameMode).then((data) => {
      if (data.error) {
        setIsLoading(false);
        return;
      }

      setGraph(data.data!);
      setIsLoading(false);
    });
  }, [gameMode]);

  const playtimeToString = (playtime: number) => {
    const hours = Math.floor(playtime / 1000 / 3600);
    const minutes = Math.floor(((playtime / 1000) % 3600) / 60);
    const seconds = Math.floor((playtime / 1000) % 60);

    return `${hours} H, ${minutes} M, ${seconds} S`;
  };

  return (
    <div className="flex flex-col">
      <PrettyHeader text="About me" icon={<User2 />} />
      <RoundedContent className="min-h-0 h-fit">
        <></>
        {/* TODO: let user set their own bio */}
      </RoundedContent>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="sm:col-span-2 col-span-2 md:col-span-1">
          <div className="bg-coffee-600 rounded-t-lg p-4 flex items-center">
            <FolderKanbanIcon className="mr-2" />
            <h2 className="text-lg font-semibold">Info</h2>
          </div>
          <div className="bg-coffee-700 p-4 rounded-b-lg min-h-60 flex flex-col">
            <div className="flex place-content-between items-end">
              <p className="text-xs">Ranked Score</p>
              <p className="text-md font-bald">
                {stats ? (
                  NumberWith(stats.ranked_score ?? 0, ",")
                ) : (
                  <SkeletonLoading className="w-32 h-4" />
                )}
              </p>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Total Score</p>
              <p className="text-md font-bald">
                {stats ? (
                  NumberWith(stats?.total_score ?? 0, ",")
                ) : (
                  <SkeletonLoading className="w-32 h-4 mt-1" />
                )}
              </p>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Maximum Combo</p>
              <p className="text-md font-bald">
                {stats ? (
                  NumberWith(stats?.max_combo ?? 0, ",")
                ) : (
                  <SkeletonLoading className="w-24 h-4 mt-1" />
                )}
              </p>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Playcount</p>
              <p className="text-md font-bald">
                {stats ? (
                  NumberWith(stats?.play_count ?? 0, ",")
                ) : (
                  <SkeletonLoading className="w-24 h-4 mt-1" />
                )}
              </p>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Hit Accuracy</p>
              <p className="text-md font-bald">
                {stats ? (
                  `${stats?.accuracy.toFixed(2)} %`
                ) : (
                  <SkeletonLoading className="w-16 h-4 mt-1" />
                )}
              </p>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Playtime</p>
              <p className="text-md font-bald">
                {stats ? (
                  playtimeToString(stats?.play_time ?? 0)
                ) : (
                  <SkeletonLoading className="w-32 h-4 mt-1" />
                )}
              </p>
            </div>

            <div className="flex border-b border-coffee-600 my-2"></div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Registered</p>
              <Tooltip content={new Date(user.register_date).toLocaleString()}>
                <p className="text-md font-bald">
                  {timeSince(user.register_date)}
                </p>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-coffee-600 rounded-t-lg px-4 py-1 flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="mr-2" />
              <h2 className="text-lg font-semibold">Rank</h2>
            </div>
            <div className="flex items-center">
              <div className="flex flex-col place-content-between items-end">
                <p className="text-sm">Performance</p>
                <p className="text-2xl font-bald text-terracotta-400">
                  {NumberWith(Math.round(stats?.pp ?? 0) ?? 0, ",")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-coffee-700 p-4 rounded-b-lg min-h-60 h-60">
            {Math.round(stats?.pp ?? 0) > 0 ? (
              <UserStatsChart data={graph} />
            ) : (
              <ContentNotExist text="Nothing to render" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
