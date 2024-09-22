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

const defaultGamemodes = ["osu!std", "osu!taiko", "osu!catch", "osu!mania"];

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("osu!std");

  const [usersObject, setUsersObject] = useState<{
    users: { user: User; stats: UserStats }[];
    total_count: number;
  }>({ users: [], total_count: -1 });

  const [page, setPage] = useState(0);

  const pageLimit = 10;

  const activeGameMode =
    GameMode[activeMode.replace("osu!", "") as keyof typeof GameMode];

  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);

    getLeaderboard(activeGameMode, "pp", page, pageLimit).then((res) => {
      if (res.error || !res.data) {
        setIsLoading(false);
        return;
      }

      setUsersObject(res.data);

      setIsLoading(false);
    });
  }, [page, activeGameMode]);

  const { users, total_count } = usersObject;
  const pageCount = Math.ceil(total_count / pageLimit - 1);

  if (isLoading && users.length === 0)
    return (
      <div className="flex flex-col">
        <PrettyHeader text="Leaderboard" icon={<ChartColumnIncreasing />} />
        <RoundedContent className="min-h-0 h-fit max-h-none bg-terracotta-700">
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        </RoundedContent>
      </div>
    );

  console.log(users);

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader text="Leaderboard" icon={<ChartColumnIncreasing />}>
        <div className="flex space-x-2">
          {defaultGamemodes.map((mode) => (
            <PrettyButton
              text={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-3 py-1 ${
                activeMode === mode ? "bg-terracotta-400 text-white" : ""
              }`}
            />
          ))}
        </div>
      </PrettyHeader>

      <RoundedContent className="mb-4 bg-terracotta-700 h-fit min-h-fit max-h-fit">
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
                  key={index}
                  className="border-b border-[#333333] hover:bg-[#333333] transition-colors"
                >
                  <td className="p-3"># {page * pageLimit + index + 1}</td>
                  <td className="p-3">
                    <img
                      src={`/images/flags/${user.user.country_code}.png`}
                      alt="Russian Flag"
                      className="w-6 h-6 mr-2"
                    />
                  </td>
                  <td className="p-3 relative flex flex-row">
                    <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white mr-4">
                      <img
                        src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user.user.user_id}`}
                        alt={`${user.user.username}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p
                      className="cursor-pointer"
                      onClick={() => window.open("/user/" + user.user.user_id)}
                    >
                      {user.user.username}
                    </p>
                  </td>
                  <td className="p-3">{user.stats.pp} pp</td>
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
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={page === pageCount}
            />
          </div>
        </div>
      </RoundedContent>
    </div>
  );
}