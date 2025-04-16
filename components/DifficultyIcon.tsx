"use client";

import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";
import { GameMode } from "@/lib/hooks/api/types";

import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";

export const osuIconFont = localFont({
  src: "../public/fonts/osu.woff2",
});

const modeBadgeMap = {
  [GameMode.std]: "\ue800",
  [GameMode.taiko]: "\ue803",
  [GameMode.catch]: "\ue801",
  [GameMode.mania]: "\ue802",
};

const modeBadge = (mode: GameMode) => {
  // @ts-ignore
  return mode in modeBadgeMap ? modeBadgeMap[mode] : "\ue800";
};

interface DifficultyIconProps {
  difficulty?: Beatmap;
  iconColor?: string;
  gameMode?: GameMode;
  className?: string;
}

export default function DifficultyIcon({
  difficulty,
  iconColor,
  gameMode,
  className,
}: DifficultyIconProps) {
  const modeBadgeText = gameMode
    ? modeBadge(gameMode)
    : difficulty
    ? modeBadge(difficulty.mode_int)
    : modeBadge(GameMode.std);

  const badgeColor =
    difficulty && gameMode
      ? getStarRatingColor(getBeatmapStarRating(difficulty, gameMode))
      : difficulty
      ? getStarRatingColor(
          getBeatmapStarRating(difficulty, difficulty.mode_int)
        )
      : iconColor
      ? iconColor
      : null;

  return (
    <p
      style={
        badgeColor
          ? {
              color: `${badgeColor}`,
            }
          : {}
      }
      className={twMerge(
        "text-2xl text-current -m-1 px-1",
        osuIconFont.className,
        className
      )}
    >
      {modeBadgeText}
    </p>
  );
}
