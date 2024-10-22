"use client";

import { Beatmap } from "@/lib/types/Beatmap";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";
import { GameMode } from "@/lib/types/GameMode";

import GameModeBadgeStd from "@/public/images/svg/mode/std.svg";
import GameModeBadgeTaiko from "@/public/images/svg/mode/taiko.svg";
import GameModeBadgeCatch from "@/public/images/svg/mode/catch.svg";
import GameModeBadgeMania from "@/public/images/svg/mode/mania.svg";

const modeBadgeMap = {
  [GameMode.std]: GameModeBadgeStd,
  [GameMode.taiko]: GameModeBadgeTaiko,
  [GameMode.catch]: GameModeBadgeCatch,
  [GameMode.mania]: GameModeBadgeMania,
};

const modeBadge = (mode: GameMode) => modeBadgeMap[mode];

interface DifficultyIconProps {
  difficulty: Beatmap;
  className?: string;
}

export default function DifficultyIcon({
  difficulty,
  className,
}: DifficultyIconProps) {
  const ModeBadge = modeBadge(difficulty.mode_int);

  return (
    <ModeBadge
      fill={`${getStarRatingColor(difficulty.star_rating)}`}
      height={24}
      width="auto"
      className={className}
    />
  );
}
