"use client";
import { ChartColumnIncreasing, Router } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useCallback, useEffect, useState, useMemo } from "react";
import Spinner from "@/components/Spinner";
import GameModeSelector from "@/components/GameModeSelector";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import { Button } from "@/components/ui/button";
import { UserDataTable } from "@/app/(website)/leaderboard/components/UserDataTable";
import { useUserColumns } from "@/app/(website)/leaderboard/components/UserColumns";
import { usePathname, useSearchParams } from "next/navigation";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { Combobox } from "@/components/ComboBox";
import { GameMode, LeaderboardSortType } from "@/lib/types/api";
import { useT } from "@/lib/i18n/utils";

export default function Leaderboard() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useT("pages.leaderboard");

  const page = tryParseNumber(searchParams.get("page")) ?? 0;
  const size = tryParseNumber(searchParams.get("size")) ?? 10;
  const mode = searchParams.get("mode") ?? GameMode.STANDARD;
  const type = searchParams.get("type") ?? LeaderboardSortType.PP;

  const [activeMode, setActiveMode] = useState(
    isInstance(mode, GameMode) ? (mode as GameMode) : GameMode.STANDARD
  );

  const [leaderboardType, setLeaderboardType] = useState(
    isInstance(type, LeaderboardSortType)
      ? (type as LeaderboardSortType)
      : LeaderboardSortType.PP
  );

  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: size,
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      pathname + "?" + createQueryString("type", leaderboardType.toString())
    );
  }, [leaderboardType, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      pathname + "?" + createQueryString("mode", activeMode.toString())
    );
  }, [activeMode, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      pathname + "?" + createQueryString("size", pagination.pageSize.toString())
    );
  }, [pagination.pageSize, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      pathname +
        "?" +
        createQueryString("page", pagination.pageIndex.toString())
    );
  }, [pagination.pageIndex, pathname, createQueryString]);

  const comboboxValues = useMemo(
    () => [
      {
        label: t("sortBy.performancePointsShort"),
        value: LeaderboardSortType.PP,
      },
      {
        label: t("sortBy.scoreShort"),
        value: LeaderboardSortType.SCORE,
      },
    ],
    [t]
  );

  const usersLeaderboardQuery = useUsersLeaderboard(
    activeMode,
    leaderboardType,
    pagination.pageIndex + 1,
    pagination.pageSize
  );

  const usersLeaderboard = usersLeaderboardQuery.data;

  const { users, total_count } = usersLeaderboard ?? {
    users: [],
    total_count: 0,
  };

  const userColumns = useUserColumns();

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<ChartColumnIncreasing />}
        roundBottom={true}
        className="text-nowrap"
      >
        <div className="place-content-end w-full gap-x-2 hidden lg:flex">
          <Button
            onClick={() => {
              setLeaderboardType(LeaderboardSortType.PP);
            }}
            variant={
              leaderboardType == LeaderboardSortType.PP
                ? "default"
                : "secondary"
            }
          >
            {t("sortBy.performancePoints")}
          </Button>
          <Button
            onClick={() => setLeaderboardType(LeaderboardSortType.SCORE)}
            variant={
              leaderboardType == LeaderboardSortType.SCORE
                ? "default"
                : "secondary"
            }
          >
            {t("sortBy.rankedScore")}
          </Button>
        </div>

        <div className="flex lg:hidden flex-col lg:flex-row">
          <p className="text-secondary-foreground text-sm">
            {t("sortBy.label")}
          </p>
          <Combobox
            activeValue={leaderboardType.toString()}
            setActiveValue={(type: any) => {
              setLeaderboardType(type);
            }}
            values={comboboxValues}
          />
        </div>
      </PrettyHeader>

      <div>
        <PrettyHeader className="border-b-0 ">
          <GameModeSelector
            activeMode={activeMode}
            setActiveMode={setActiveMode}
          />
        </PrettyHeader>

        <div className="rounded-b-3xl bg-card mb-4 border border-t-0 shadow">
          <RoundedContent className="rounded-t-xl border-none shadow-none">
            {usersLeaderboardQuery.isLoading && users.length === 0 ? (
              <div className="flex justify-center items-center min-h-36">
                <Spinner />
              </div>
            ) : (
              <UserDataTable
                columns={userColumns}
                data={users}
                pagination={pagination}
                totalCount={total_count}
                leaderboardType={leaderboardType}
                setPagination={setPagination}
              />
            )}
          </RoundedContent>
        </div>
      </div>
    </div>
  );
}
