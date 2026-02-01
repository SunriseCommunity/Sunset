import { FolderKanbanIcon, HistoryIcon, Trophy, User2 } from "lucide-react";
import { useState } from "react";

import UserGrades from "@/app/(website)/user/[id]/components/UserGrades";
import { UserLevelProgress } from "@/app/(website)/user/[id]/components/UserLevelProgress";
import UserPlayHistoryChart from "@/app/(website)/user/[id]/components/UserPlayHistoryChart";
import UserStatsChart from "@/app/(website)/user/[id]/components/UserStatsChart";
import BBCodeTextField from "@/components/BBCode/BBCodeTextField";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserGrades } from "@/lib/hooks/api/user/useUserGrades";
import { useUserGraph } from "@/lib/hooks/api/user/useUserGraph";
import { useUserPlayHistoryGraph } from "@/lib/hooks/api/user/useUserPlayHistoryGraph";
import { useT } from "@/lib/i18n/utils";
import type { GameMode, UserResponse, UserStatsResponse } from "@/lib/types/api";
import NumberWith from "@/lib/utils/numberWith";
import { playtimeToString } from "@/lib/utils/playtimeToString";

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
  const t = useT("pages.user.components.generalTab");
  const [chartValue, setChartValue] = useState<"pp" | "rank">("pp");

  const userGradesQuery = useUserGrades(user.user_id, gameMode);
  const userGraphQuery = useUserGraph(user.user_id, gameMode);

  const userPlayHistoryGraphQuery = useUserPlayHistoryGraph(user.user_id);

  const userGrades = userGradesQuery.data;
  const userGraph = userGraphQuery.data;
  const userPlayHistoryGraph = userPlayHistoryGraphQuery.data;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-4">
        <div className="col-span-2 flex flex-col sm:col-span-1">
          <PrettyHeader
            text={t("info")}
            icon={<FolderKanbanIcon className="mr-2" />}
          />

          <RoundedContent className="flex h-fit flex-col rounded-b-lg p-4">
            <div className="mb-3">
              {stats ? (
                <UserLevelProgress totalScore={stats.total_score} />
              ) : (
                <Skeleton className="h-10 w-full" />
              )}
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">{t("rankedScore")}</p>
              <div className="font-bald text-sm">
                {stats ? (
                  NumberWith(stats.ranked_score ?? 0, ",")
                ) : (
                  <Skeleton className="h-4 w-32" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">{t("hitAccuracy")}</p>
              <div className="font-bald text-sm">
                {stats ? (
                  `${stats?.accuracy.toFixed(2)} %`
                ) : (
                  <Skeleton className="mt-1 h-4 w-16" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">{t("playcount")}</p>
              <div className="font-bald text-sm">
                {stats ? (
                  NumberWith(stats?.play_count ?? 0, ",")
                ) : (
                  <Skeleton className="mt-1 h-4 w-24" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">{t("totalScore")}</p>
              <div className="font-bald text-sm">
                {stats ? (
                  NumberWith(stats?.total_score ?? 0, ",")
                ) : (
                  <Skeleton className="mt-1 h-4 w-32" />
                )}
              </div>
            </div>

            <div className="flex place-content-between items-end">
              <p className="text-xs">{t("maximumCombo")}</p>
              <div className="font-bald text-sm">
                {stats ? (
                  NumberWith(stats?.max_combo ?? 0, ",")
                ) : (
                  <Skeleton className="mt-1 h-4 w-24" />
                )}
              </div>
            </div>

            <div className="my-2 flex place-content-between items-end">
              <p className="text-sm">{t("playtime")}</p>
              <div className="font-bald text-sm">
                {stats ? (
                  playtimeToString(stats?.play_time ?? 0)
                ) : (
                  <Skeleton className="mt-1 h-4 w-32" />
                )}
              </div>
            </div>

            <div className="my-1 flex border-b" />

            <div>
              {userGrades ? (
                <UserGrades grades={userGrades} />
              ) : (
                <Skeleton className="h-12" />
              )}
            </div>
          </RoundedContent>
        </div>

        <div className="col-span-2 flex flex-col">
          <PrettyHeader
            text={t("performance")}
            icon={<Trophy className="mr-2" />}
            className="flex-wrap px-4 py-1"
          >
            <div className="flex flex-col place-content-between items-end">
              <p className="text-sm">{t("performance")}</p>
              <p className="font-bald text-2xl text-primary">
                {NumberWith(Math.round(stats?.pp ?? 0) ?? 0, ",")}
              </p>
            </div>
          </PrettyHeader>
          <RoundedContent>
            {userGraph && (
              <>
                <UserStatsChart data={userGraph} value={chartValue} />
                <div className="flex w-full place-content-end gap-x-2 pt-2">
                  <Button
                    onClick={() => setChartValue("rank")}
                    variant={chartValue === "rank" ? "default" : "secondary"}
                  >
                    {t("showByRank")}
                  </Button>
                  <Button
                    onClick={() => setChartValue("pp")}
                    variant={chartValue === "pp" ? "default" : "secondary"}
                  >
                    {t("showByPp")}
                  </Button>
                </div>
              </>
            )}
          </RoundedContent>
        </div>

        {user.description && user.description.length > 0 && (
          <div className="col-span-2  lg:col-span-3 ">
            <PrettyHeader text={t("aboutMe")} icon={<User2 />} />
            <RoundedContent className="h-fit min-h-0">
              <div className="max-h-96 overflow-y-auto">
                <BBCodeTextField text={user.description} />
              </div>
            </RoundedContent>
          </div>
        )}

        {userPlayHistoryGraph && userPlayHistoryGraph.snapshots.length > 0 && (
          <div className="col-span-2 lg:col-span-3">
            <PrettyHeader text={t("playHistory")} icon={<HistoryIcon />} />
            <RoundedContent className="h-fit min-h-0">
              <UserPlayHistoryChart data={userPlayHistoryGraph} />
            </RoundedContent>
          </div>
        )}
      </div>
    </div>
  );
}
