"use client";
import { ChartColumnIncreasing, Router } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useCallback, useEffect, useState } from "react";
import { GameMode } from "@/lib/hooks/api/types";
import Spinner from "@/components/Spinner";
import GameModeSelector from "@/components/GameModeSelector";
import { UsersLeaderboardType } from "@/lib/hooks/api/user/types";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import { Button } from "@/components/ui/button";
import { UserDataTable } from "@/app/leaderboard/components/UserDataTable";
import { userColumns } from "@/app/leaderboard/components/UserColumns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { tryParseNumber } from "@/lib/utils/type.util";
import { Combobox } from "@/components/ComboBox";

export default function Leaderboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = tryParseNumber(searchParams.get("page")) ?? 0;
  const size = tryParseNumber(searchParams.get("size")) ?? 10;
  const mode = tryParseNumber(searchParams.get("mode")) ?? GameMode.std;
  const type =
    tryParseNumber(searchParams.get("type")) ?? UsersLeaderboardType.pp;

  const [activeMode, setActiveMode] = useState(
    mode in GameMode ? mode : GameMode.std
  );

  const [leaderboardType, setLeaderboardType] = useState(
    type in UsersLeaderboardType ? type : UsersLeaderboardType.pp
  );

  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: size,
  });

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("type", leaderboardType.toString())
    );
  }, [leaderboardType]);

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("mode", activeMode.toString())
    );
  }, [activeMode]);

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("size", pagination.pageSize.toString())
    );
  }, [pagination.pageSize]);

  useEffect(() => {
    router.push(
      pathname +
        "?" +
        createQueryString("page", pagination.pageIndex.toString())
    );
  }, [pagination.pageIndex]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
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

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        text="Leaderboard"
        icon={<ChartColumnIncreasing />}
        className="mb-4"
        roundBottom={true}
      >
        <div className="place-content-end w-full gap-x-2 pt-2 hidden lg:flex">
          <Button
            onClick={() => {
              setLeaderboardType(UsersLeaderboardType.pp);
            }}
            variant={
              leaderboardType == UsersLeaderboardType.pp
                ? "default"
                : "secondary"
            }
          >
            Performance points
          </Button>
          <Button
            onClick={() => setLeaderboardType(UsersLeaderboardType.score)}
            variant={
              leaderboardType == UsersLeaderboardType.score
                ? "default"
                : "secondary"
            }
          >
            Ranked Score
          </Button>
        </div>
      </PrettyHeader>

      <PrettyHeader className="border-b-0 shadow-none grid sm:flex  place-content-start sm:place-content-between sm:space-y-0 space-y-2">
        <div className="flex lg:hidden flex-col lg:flex-row">
          <p className="text-secondary-foreground text-sm">Sort by:</p>
          <Combobox
            activeValue={leaderboardType.toString()}
            setActiveValue={(type: any) => {
              setLeaderboardType(parseInt(type));
            }}
            values={[
              {
                label: "Performance points",
                value: UsersLeaderboardType.pp.toString(),
              },
              {
                label: "Score",
                value: UsersLeaderboardType.score.toString(),
              },
            ]}
          />
        </div>
        <div className="flex lg:w-full place-content-between lg:flex-row flex-col">
          <p className="text-secondary-foreground text-sm lg:hidden flex">
            Selected mode:
          </p>
          <GameModeSelector
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            className="lg:place-content-between place-content-start"
          />
        </div>
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
  );
}
