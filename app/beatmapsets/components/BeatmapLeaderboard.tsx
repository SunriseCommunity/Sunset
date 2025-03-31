"use client";
import RoundedContent from "@/components/General/RoundedContent";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { Score } from "@/lib/types/Score";
import { getBeatmapLeaderboard } from "@/lib/actions/getBeatmapLeaderboard";
import { GameMode } from "@/lib/hooks/api/types";
import { twMerge } from "tailwind-merge";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { getGradeColor } from "@/lib/utils/getGradeColor";

interface BeatmapLeaderboardProps {
  beatmap: Beatmap;
  mode: GameMode;
}

export default function BeatmapLeaderboard({
  beatmap,
  mode,
}: BeatmapLeaderboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [scoresObject, setScoresObject] = useState<{
    scores: Score[];
    total_count: number;
  }>({ scores: [], total_count: -1 });

  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);

    getBeatmapLeaderboard(beatmap.id, mode).then((res) => {
      if (res.error || !res.data) {
        setIsLoading(false);
        return;
      }

      setScoresObject(res.data);

      setIsLoading(false);
    });
  }, [beatmap, mode]);

  const { scores, total_count } = scoresObject;

  return (
    <div className="flex flex-col w-full">
      <RoundedContent className="mb-4 bg-transparent ">
        <div className="bg-terracotta-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-terracotta-500 text-left">
                <th className="p-2">Rank</th>
                <th className="p-2"></th>
                <th className="p-2">Score</th>
                <th className="p-2">Accuracy</th>
                <th className="p-2">Player</th>
                <th className="p-2">Combo</th>
                <th className="p-2">300</th>
                <th className="p-2">100</th>
                <th className="p-2">50</th>
                <th className="p-2">Miss</th>
                <th className="p-2">PP</th>
                <th className="p-2">Mods</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && scores.length <= 0 && (
                <tr>
                  <td colSpan={13} className="p-3 text-center">
                    <Spinner />
                  </td>
                </tr>
              )}
              {!isLoading && scores.length === 0 && (
                <tr>
                  <td colSpan={13} className="p-3 text-center">
                    No scores found. Be the first to submit one!
                  </td>
                </tr>
              )}
              {scores.map((score, index) => (
                <tr
                  key={index}
                  className="border-b border-[#333333] hover:bg-[#333333] transition-colors cursor-pointer"
                  onClick={() => {
                    window.location.href = `/score/${score.id}`;
                  }}
                >
                  <td className="p-2 text-lg font-bold">#{index + 1}</td>
                  <td
                    className={`text-${getGradeColor(
                      score.grade
                    )} text-2xl p-2 font-bold`}
                  >
                    {score.grade}
                  </td>
                  <td className="p-2">{score.total_score.toLocaleString()}</td>
                  <td
                    className={twMerge(
                      "text-base p-2",
                      score.accuracy === 100 ? "text-terracotta-300" : ""
                    )}
                  >
                    {score.accuracy.toFixed(2)}%
                  </td>
                  <td className="p-2  truncate overflow-hidden whitespace-nowrap max-w-28">
                    <span>{score.user.username}</span>
                  </td>
                  <td
                    className={twMerge(
                      "text-base p-2",
                      score.max_combo === beatmap?.max_combo
                        ? "text-terracotta-300"
                        : ""
                    )}
                  >
                    {score.max_combo}x
                  </td>
                  <td className="p-2">{score.count_300}</td>
                  <td className="p-2">{score.count_100}</td>
                  <td className="p-2">{score.count_50}</td>
                  <td className="p-2">{score.count_miss}</td>
                  <td className="p-2">{score.performance_points.toFixed(2)}</td>
                  <td className="p-2">{score.mods}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RoundedContent>
    </div>
  );
}
