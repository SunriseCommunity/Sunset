"use client";
import { ChartColumnIncreasing, ChevronLeft, ChevronRight } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useEffect, useState } from "react";
import PrettyButton from "@/components/General/PrettyButton";
import { GameMode } from "@/lib/hooks/api/types";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import GameModeSelector from "@/components/GameModeSelector";
import { UsersLeaderboardType } from "@/lib/hooks/api/user/types";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import numberWith from "@/lib/utils/numberWith";
import { Button } from "@/components/ui/button";

export default function Leaderboard() {
  const [activeMode, setActiveMode] = useState(GameMode.std);
  const [leaderboardType, setLeaderboardType] = useState(
    UsersLeaderboardType.pp
  );
  const [page, setPage] = useState(1);

  const pageLimit = 10;

  const usersLeaderboardQuery = useUsersLeaderboard(
    activeMode,
    leaderboardType,
    page,
    pageLimit
  );

  const usersLeaderboard = usersLeaderboardQuery.data;

  useEffect(() => {
    setPage(1);
  }, [activeMode]);

  const { users, total_count } = usersLeaderboard ?? {
    users: [],
    total_count: 0,
  };

  const pageCount = Math.ceil(total_count / pageLimit);

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        text="Leaderboard"
        icon={<ChartColumnIncreasing />}
        className="mb-4"
        roundBottom={true}
      >
        <div className="flex place-content-end w-full gap-x-2 pt-2">
          {/* <PrettyButton
            onClick={() => setLeaderboardType(UsersLeaderboardType.pp)}
            text="Performance points"
            className="px-3 py-1"
            isSelected={leaderboardType == UsersLeaderboardType.pp}
          />
          <PrettyButton
            onClick={() => setLeaderboardType(UsersLeaderboardType.score)}
            text="Ranked Score"
            className="px-3 py-1"
            isSelected={leaderboardType == UsersLeaderboardType.score}
          /> */}
          <Button
            onClick={() => setLeaderboardType(UsersLeaderboardType.pp)}
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

      <PrettyHeader className="border-b-0 shadow-none">
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </PrettyHeader>

      {usersLeaderboardQuery.isLoading && users.length === 0 && (
        <div className="rounded-b-3xl mb-4">
          <RoundedContent className="min-h-0 h-fit max-h-none rounded-t-xl">
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          </RoundedContent>
        </div>
      )}

      {!usersLeaderboardQuery.isLoading && users.length > 0 && (
        <div className="rounded-b-3xl bg-card mb-4 border shadow">
          <RoundedContent className="rounded-t-xl border-none shadow-none">
            <div className="bg-popover/50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Flag</th>
                    <th className="p-3">Player</th>
                    <th className="p-3">
                      {leaderboardType == UsersLeaderboardType.pp
                        ? "Performance"
                        : "Ranked Score"}
                    </th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Play Count</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="border-y border-accent hover:bg-popover transition-colors"
                    >
                      <td className="p-3 text-lg font-bold">
                        # {index + (page - 1) * pageLimit + 1}
                      </td>
                      <td className="p-3">
                        <Image
                          src={`/images/flags/${user.user.country_code}.png`}
                          alt="User Flag"
                          className="mr-2"
                          width={26}
                          height={26}
                        />
                      </td>
                      <td className="p-3 relative flex flex-row items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white mr-4">
                          <Image
                            src={user.user.avatar_url}
                            alt={`${user.user.username}'s avatar`}
                            objectFit="cover"
                            width={42}
                            height={42}
                          />
                        </div>

                        <p
                          className="cursor-pointer hover:text-terracotta-400 smooth-transition text-lg font-bold"
                          onClick={() =>
                            (window.location.href = `/user/${user.user.user_id}`)
                          }
                        >
                          {user.user.username}
                        </p>
                      </td>
                      <td className="p-3">
                        {leaderboardType == UsersLeaderboardType.pp
                          ? `${Math.round(user.stats.pp)} pp`
                          : numberWith(
                              Math.round(user.stats.ranked_score),
                              ","
                            )}
                      </td>
                      <td className="p-3">{user.stats.accuracy.toFixed(2)}%</td>
                      <td className="p-3">{user.stats.play_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                Showing {(page - 1) * pageLimit + 1} -{" "}
                {Math.min(page * pageLimit, total_count)} of {total_count}{" "}
              </div>

              <div className="flex space-x-2">
                <PrettyButton
                  icon={<ChevronLeft />}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                />

                <PrettyButton
                  icon={<ChevronRight />}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pageCount))
                  }
                  disabled={page === pageCount}
                />
              </div>
            </div>
          </RoundedContent>
        </div>
      )}
    </div>
  );
}
