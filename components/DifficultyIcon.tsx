"use client";

import { Beatmap } from "@/lib/types/Beatmap";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";
import { GameMode } from "@/lib/types/GameMode";

import GameModeBadgeStd from "@/public/images/svg/mode/std.svg";
import GameModeBadgeTaiko from "@/public/images/svg/mode/taiko.svg";
import GameModeBadgeCatch from "@/public/images/svg/mode/catch.svg";
import GameModeBadgeMania from "@/public/images/svg/mode/mania.svg";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

const modeBadgeMap = {
  [GameMode.std]: GameModeBadgeStd,
  [GameMode.taiko]: GameModeBadgeTaiko,
  [GameMode.catch]: GameModeBadgeCatch,
  [GameMode.mania]: GameModeBadgeMania,
};

const modeBadge = (mode: GameMode) => {
  // @ts-ignore
  return mode in modeBadgeMap ? modeBadgeMap[mode] : GameModeBadgeStd;
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
  const ModeBadge = gameMode
    ? modeBadge(gameMode)
    : difficulty
    ? modeBadge(difficulty.mode_int)
    : modeBadge(GameMode.std);

  const BadgeColor =
    difficulty && gameMode
      ? getStarRatingColor(getBeatmapStarRating(difficulty, gameMode))
      : difficulty
      ? getStarRatingColor(
          getBeatmapStarRating(difficulty, difficulty.mode_int)
        )
      : iconColor
      ? iconColor
      : "#000000";

  return (
    <ModeBadge
      fill={BadgeColor}
      height={24}
      width="auto"
      className={className}
    />
  );
}
