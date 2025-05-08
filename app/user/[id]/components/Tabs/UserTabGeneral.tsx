import UserGrades from "@/app/user/[id]/components/UserGrades";
import UserStatsChart from "@/app/user/[id]/components/UserStatsChart";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { getLevelWithProgress } from "@/lib/utils/userLevel";
import NumberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import { FolderKanbanIcon, Trophy, User2 } from "lucide-react";
import { playtimeToString } from "@/lib/utils/playtimeToString";
import { useUserGrades } from "@/lib/hooks/api/user/useGraph";
import { useUserGraph } from "@/lib/hooks/api/user/useUserGraph";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/Tooltip";
import { GameMode, UserResponse, UserStatsResponse } from "@/lib/types/api";

import BBCodeTextField from "@/components/BBCode/BBCodeTextField";

interface UserTabGeneralProps {
  user: UserResponse;
  stats: UserStatsResponse | undefined;
  gameMode: GameMode;
}

export default function UserTabGeneral({
  user,
  stats,
  gameMode,
}: UserTabGeneralProps) {
  const [chartValue, setChartValue] = useState<"pp" | "rank">("pp");

  const userGradesQuery = useUserGrades(user.user_id, gameMode);
  const userGraphQuery = useUserGraph(user.user_id, gameMode);

  const userGrades = userGradesQuery.data;
  const userGraph = userGraphQuery.data;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 gap-4">
        <div className="flex flex-col col-span-2 sm:col-span-1">
          <PrettyHeader
            text="Info"
            icon={<FolderKanbanIcon className="mr-2" />}
          />

          <RoundedContent className="p-4 rounded-b-lg h-fit flex flex-col">
            <div className="flex place-content-between items-end">
              <p className="text-xs">Ranked Score</p>
              <div className="text-md font-bald">
                {stats ? (
                  NumberWith(stats.ranked_score ?? 0, ",")
                ) : (
                  <Skeleton className="w-32 h-4" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Total Score</p>
              <div className="text-md font-bald">
                {stats ? (
                  NumberWith(stats?.total_score ?? 0, ",")
                ) : (
                  <Skeleton className="w-32 h-4 mt-1" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Maximum Combo</p>
              <div className="text-md font-bald">
                {stats ? (
                  NumberWith(stats?.max_combo ?? 0, ",")
                ) : (
                  <Skeleton className="w-24 h-4 mt-1" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Playcount</p>
              <div className="text-md font-bald">
                {stats ? (
                  NumberWith(stats?.play_count ?? 0, ",")
                ) : (
                  <Skeleton className="w-24 h-4 mt-1" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Hit Accuracy</p>
              <div className="text-md font-bald">
                {stats ? (
                  `${stats?.accuracy.toFixed(2)} %`
                ) : (
                  <Skeleton className="w-16 h-4 mt-1" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Level</p>
              <div className="text-md font-bald">
                {stats ? (
                  getLevelWithProgress(BigInt(stats?.total_score) ?? 0).toFixed(
                    2
                  )
                ) : (
                  <Skeleton className="w-32 h-4 mt-1" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Playtime</p>
              <div className="text-md font-bald">
                {stats ? (
                  playtimeToString(stats?.play_time ?? 0)
                ) : (
                  <Skeleton className="w-32 h-4 mt-1" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">Registered</p>
              <Tooltip content={new Date(user.register_date).toLocaleString()}>
                <p className="text-md font-bald">
                  {timeSince(user.register_date)}
                </p>
              </Tooltip>
            </div>

            <div className="flex border-b my-1"></div>

            <div>
              {userGrades ? (
                <UserGrades grades={userGrades} />
              ) : (
                <Skeleton className="h-12" />
              )}
            </div>
          </RoundedContent>
        </div>

        <div className="flex flex-col col-span-2">
          {/* <div className="rounded-t-lg px-4 py-1 flex justify-between items-center"> */}

          <PrettyHeader
            text="Performance"
            icon={<Trophy className="mr-2" />}
            className="px-4 py-1"
          >
            <div className="flex flex-col place-content-between items-end">
              <p className="text-sm">Performance</p>
              <p className="text-2xl font-bald text-primary">
                {NumberWith(Math.round(stats?.pp ?? 0) ?? 0, ",")}
              </p>
            </div>
          </PrettyHeader>
          <RoundedContent>
            {userGraph && (
              <>
                <UserStatsChart data={userGraph} value={chartValue} />
                <div className="flex place-content-end w-full gap-x-2 pt-2">
                  <Button
                    onClick={() => setChartValue("rank")}
                    variant={chartValue == "rank" ? "default" : "secondary"}
                  >
                    Show by rank
                  </Button>
                  <Button
                    onClick={() => setChartValue("pp")}
                    variant={chartValue == "pp" ? "default" : "secondary"}
                  >
                    Show by pp
                  </Button>
                </div>
              </>
            )}
          </RoundedContent>
        </div>

        {user.description && user.description.length > 0 && (
          <div className="lg:col-span-3  md:col-span-2 ">
            <PrettyHeader text="About me" icon={<User2 />} />
            <RoundedContent className="min-h-0 h-fit">
              <div className="max-h-96 overflow-y-auto">
                <BBCodeTextField text={user.description} />
              </div>
            </RoundedContent>
          </div>
        )}
      </div>
    </div>
  );
}
