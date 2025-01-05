"use client";
import { ChartColumnIncreasing, ChevronLeft, ChevronRight } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useEffect, useState } from "react";
import { UserStats } from "@/lib/types/UserStats";
import { User } from "@/lib/types/User";
import PrettyButton from "@/components/General/PrettyButton";
import { getLeaderboard } from "@/lib/actions/getLeaderboard";
import { GameMode } from "@/lib/types/GameMode";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import GameModeSelector from "@/components/GameModeSelector";

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState(GameMode.std);

  const [usersObject, setUsersObject] = useState<{
    users: { user: User; stats: UserStats }[];
    total_count: number;
  }>({ users: [], total_count: -1 });

  const [page, setPage] = useState(0);

  const pageLimit = 10;

  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);

    getLeaderboard(activeMode, "pp", page, pageLimit).then((res) => {
      if (res.error || !res.data) {
        setIsLoading(false);
        return;
      }

      setUsersObject(res.data);

      setIsLoading(false);
    });
  }, [page, activeMode]);

  useEffect(() => {
    setPage(0);
  }, [activeMode]);

  const { users, total_count } = usersObject;
  const pageCount = Math.ceil(total_count / pageLimit - 1);

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        text="Leaderboard"
        icon={<ChartColumnIncreasing />}
        className="bg-terracotta-650 mb-4"
        roundBottom={true}
      />

      <PrettyHeader className="bg-terracotta-650">
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </PrettyHeader>

      {isLoading && users.length === 0 && (
        <div className="bg-terracotta-650 rounded-b-3xl mb-4">
          <RoundedContent className="min-h-0 h-fit max-h-none bg-terracotta-700 rounded-t-xl">
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          </RoundedContent>
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="bg-terracotta-650 rounded-b-3xl mb-4">
          <RoundedContent className="bg-terracotta-700 rounded-t-xl">
            <div className="bg-terracotta-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-terracotta-500 text-left">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Flag</th>
                    <th className="p-3">Player</th>
                    <th className="p-3">Performance</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Play Count</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={page * pageLimit + index + 1}
                      className="border-b border-[#333333] hover:bg-[#333333] transition-colors"
                    >
                      <td className="p-3 text-lg font-bold">
                        # {page * pageLimit + index + 1}
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
                            src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user.user.user_id}`}
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
                      <td className="p-3">{Math.round(user.stats.pp)} pp</td>
                      <td className="p-3">{user.stats.accuracy.toFixed(2)}%</td>
                      <td className="p-3">{user.stats.play_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                Showing {page * pageLimit + 1} -{" "}
                {Math.min((page + 1) * pageLimit, total_count)} of {total_count}{" "}
              </div>

              <div className="flex space-x-2">
                <PrettyButton
                  icon={<ChevronLeft />}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
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
