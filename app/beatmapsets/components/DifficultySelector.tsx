"use client";

import { Beatmap } from "@/lib/types/Beatmap";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";
import { twMerge } from "tailwind-merge";

import { useState } from "react";
import DifficultyIcon from "@/components/DifficultyIcon";

interface DifficultySelectorProps {
  difficulties: Beatmap[];
  activeDifficulty: Beatmap;
  setDifficulty: (difficulty: Beatmap) => void;
  className?: string;
}

// TODO: should convert osu!std maps to a current mode

export default function DifficultySelector({
  difficulties,
  activeDifficulty,
  setDifficulty,
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
          .sort((a, b) => a.star_rating - b.star_rating)
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
              <DifficultyIcon difficulty={difficulty} />
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
            ★ {hoveredDifficulty.star_rating}
          </p>
        )}
      </div>
    </div>
  );
}
