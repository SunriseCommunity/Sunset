"use client";

import { Beatmap } from "@/lib/types/Beatmap";
import { twMerge } from "tailwind-merge";

import { useState } from "react";
import DifficultyIcon from "@/components/DifficultyIcon";
import { GameMode } from "@/lib/types/GameMode";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface DifficultySelectorProps {
  difficulties: Beatmap[];
  activeDifficulty: Beatmap;
  setDifficulty: (difficulty: Beatmap) => void;
  activeGameMode: GameMode;
  className?: string;
}

export default function DifficultySelector({
  difficulties,
  activeDifficulty,
  setDifficulty,
  activeGameMode,
  className,
}: DifficultySelectorProps) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<Beatmap | null>(
    null
  );

  return (
    <div className="flex flex-col space-y-1">
      <div
        className={twMerge(
          "flex  bg-terracotta-700 rounded-lg bg-opacity-80 w-fit",
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
              <DifficultyIcon difficulty={difficulty} gameMode={activeGameMode} />
            </div>
          ))}
      </div>
      <div className="flex flex-row items-center space-x-2">
        <p className="text-gray-100 text-lg">
          {hoveredDifficulty
            ? hoveredDifficulty.version
            : activeDifficulty.version}
        </p>
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
