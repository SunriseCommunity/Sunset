"use client";


import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";


import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";
import { BeatmapResponse, GameMode } from "@/lib/types/api";

export const osuIconFont = localFont({
  src: "../public/fonts/osu.woff2",
});

const modeBadgeMap = {
  [GameMode.STANDARD]: "\ue800",
  [GameMode.TAIKO]: "\ue803",
  [GameMode.CATCH_THE_BEAT]: "\ue801",
  [GameMode.MANIA]: "\ue802",
};

const modeBadge = (mode: GameMode) => {
  // @ts-ignore
  return mode in modeBadgeMap ? modeBadgeMap[mode] : "\ue800";
};

interface DifficultyIconProps {
  difficulty?: BeatmapResponse;
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
    ? modeBadge(difficulty.mode)
    : modeBadge(GameMode.STANDARD);

  const badgeColor =
    difficulty && gameMode
      ? getStarRatingColor(getBeatmapStarRating(difficulty, gameMode))
      : difficulty
      ? getStarRatingColor(getBeatmapStarRating(difficulty, difficulty.mode))
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
