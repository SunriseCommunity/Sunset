import { Trophy } from "lucide-react";
import { useState } from "react";

import UserGrades from "@/app/(website)/user/[id]/components/UserGrades";
import UserRanks from "@/app/(website)/user/[id]/components/UserRanks";
import UserStatsChart from "@/app/(website)/user/[id]/components/UserStatsChart";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserGrades } from "@/lib/hooks/api/user/useUserGrades";
import { useUserGraph } from "@/lib/hooks/api/user/useUserGraph";
import { useT } from "@/lib/i18n/utils";
import type { GameMode, UserResponse, UserStatsResponse } from "@/lib/types/api";
import NumberWith from "@/lib/utils/numberWith";
import { playtimeToString } from "@/lib/utils/playtimeToString";

interface UserProfileOverviewProps {
  user: UserResponse;
  stats: UserStatsResponse | undefined;
  gameMode: GameMode;
}

export default function UserProfileOverview({
  user,
  stats,
  gameMode,
}: UserProfileOverviewProps) {
  const t = useT("pages.user.components.generalTab");
  const [chartValue, setChartValue] = useState<"pp" | "rank">("pp");

  const userGradesQuery = useUserGrades(user.user_id, gameMode);
  const userGraphQuery = useUserGraph(user.user_id, gameMode);

  const userGrades = userGradesQuery.data;
  const userGraph = userGraphQuery.data;
  const hasGraph = Boolean(userGraph && userGraph.snapshots.length > 0);

  const statsRows = [
    { label: t("rankedScore"), value: stats && NumberWith(stats.ranked_score ?? 0, ",") },
    {
      label: t("hitAccuracy"),
      value: stats && `${stats.accuracy.toFixed(2)} %`,
    },
    { label: t("playcount"), value: stats && NumberWith(stats.play_count ?? 0, ",") },
    { label: t("totalScore"), value: stats && NumberWith(stats.total_score ?? 0, ",") },
    { label: t("maximumCombo"), value: stats && NumberWith(stats.max_combo ?? 0, ",") },
    { label: t("playtime"), value: stats && playtimeToString(stats.play_time ?? 0) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col lg:col-span-3">
        <PrettyHeader
          text={t("performance")}
          icon={<Trophy className="mr-2" />}
          className="flex-wrap gap-2 px-4 py-2"
        >
          <div className="flex items-baseline gap-2">
            <p className="text-current/60 text-xs uppercase tracking-wide">
              {t("pp")}
            </p>
            <p className="text-2xl font-extrabold leading-none text-primary md:text-3xl">
              {stats ? (
                NumberWith(Math.round(stats.pp ?? 0), ",")
              ) : (
                <Skeleton className="h-6 w-16" />
              )}
            </p>
          </div>
        </PrettyHeader>
        <RoundedContent className="grid grid-cols-1 gap-4 bg-card lg:grid-cols-3">
          <div className="flex min-w-0 flex-col lg:col-span-2">
            <div className="mb-2 flex">
              <UserRanks user={user} userStats={stats} />
            </div>
            {userGraph && hasGraph ? (
              <>
                <UserStatsChart data={userGraph} value={chartValue} />
                <div className="flex w-full justify-end gap-x-2 pt-2">
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
            ) : (
              <div className="flex min-h-36 flex-1 items-center justify-center text-sm text-muted-foreground">
                {t("noPerformanceHistory")}
              </div>
            )}
          </div>

          <div className="border-current/10 flex flex-col justify-center gap-1.5 lg:border-l lg:pl-4">
            {statsRows.map(row => (
              <div
                key={row.label}
                className="flex place-content-between items-end gap-4"
              >
                <p className="text-current/70 text-xs">{row.label}</p>
                <div className="text-sm font-semibold">
                  {row.value ?? <Skeleton className="h-4 w-20" />}
                </div>
              </div>
            ))}
            <div className="border-current/10 my-2 flex border-b" />
            {userGrades ? (
              <UserGrades grades={userGrades} />
            ) : (
              <Skeleton className="h-12" />
            )}
          </div>
        </RoundedContent>
      </div>
    </div>
  );
}
