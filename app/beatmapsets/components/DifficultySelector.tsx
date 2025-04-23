"use client";

import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { twMerge } from "tailwind-merge";

import { useState } from "react";
import DifficultyIcon from "@/components/DifficultyIcon";
import { GameMode } from "@/lib/hooks/api/types";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";

interface DifficultySelectorProps {
  beatmapset: BeatmapSet;
  difficulties: Beatmap[];
  activeDifficulty: Beatmap;
  setDifficulty: (difficulty: Beatmap) => void;
  activeGameMode: GameMode;
  className?: string;
}

export default function DifficultySelector({
  beatmapset,
  difficulties,
  activeDifficulty,
  setDifficulty,
  activeGameMode,
  className,
}: DifficultySelectorProps) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<Beatmap | null>(
    null
  );

  const selectedDifficulty = hoveredDifficulty
    ? hoveredDifficulty
    : activeDifficulty;

  return (
    <div className="flex flex-col space-y-1 ">
      <div
        className={twMerge(
          "flex bg-terracotta-700 rounded-lg bg-opacity-80 w-fit mr-6 flex-wrap",
          className
        )}
      >
        {difficulties
          .sort(
            (a, b) =>
              getBeatmapStarRating(a, activeGameMode) -
              getBeatmapStarRating(b, activeGameMode)
          )
          .sort((a, b) => a.mode_int - b.mode_int) // Lazy sort, but it works since osu! (0) is always lower than other modes
          .map((difficulty) => (
            <div
              className={twMerge(
                "hover:bg-terracotta-800 rounded-lg cursor-pointer hover:border-opacity-100 border-2 p-1 border-opacity-0  border-yellow-pastel transition-all duration-200 ease-in-out",
                activeDifficulty.id === difficulty.id
                  ? "border-opacity-100"
                  : ""
              )}
              key={difficulty.id}
              onMouseOver={() => setHoveredDifficulty(difficulty)}
              onMouseLeave={() => setHoveredDifficulty(null)}
              onClick={() => setDifficulty(difficulty)}
            >
              <DifficultyIcon
                difficulty={difficulty}
                gameMode={activeGameMode}
              />
            </div>
          ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-gray-100 text-lg">{selectedDifficulty.version}</p>
        {selectedDifficulty.creator_id != beatmapset.creator_id && (
          <p className="text-gray-100 text-sm font-light">
            mapped by&nbsp;
            <span className="text-gray-200 font-bold">
              {selectedDifficulty.creator}
            </span>
          </p>
        )}

        {hoveredDifficulty && (
          <p className="text-yellow-400 text-xs">
            ★{" "}
            {getBeatmapStarRating(hoveredDifficulty, activeGameMode).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
