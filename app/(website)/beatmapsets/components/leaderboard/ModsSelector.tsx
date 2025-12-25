import { twMerge } from "tailwind-merge";

import RoundedContent from "@/components/General/RoundedContent";
import { ModElement } from "@/components/ModIcons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import { GameMode, Mods } from "@/lib/types/api";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";

const modElements = [
  Mods.NONE,
  Mods.EASY,
  Mods.NO_FAIL,
  Mods.HALF_TIME,
  Mods.HARD_ROCK,
  Mods.SUDDEN_DEATH,
  Mods.PERFECT,
  Mods.DOUBLE_TIME,
  Mods.NIGHTCORE,
  Mods.HIDDEN,
  Mods.FLASHLIGHT,
  Mods.SPUN_OUT,
  Mods.RELAX2,
  Mods.RELAX,
  Mods.SCORE_V2,
];

export function ModsSelector({
  mods,
  setMods,
  mode,
  variant = "small",
  ignoreMods,
  className,
}: {
  mods: Mods[];
  setMods: (mods: Mods[]) => void;
  mode?: GameMode;
  variant?: "small" | "big";
  ignoreMods?: Mods[];
  className?: string;
}) {
  if (mode) {
    // eslint-disable-next-line no-param-reassign -- expected
    ignoreMods = [
      ...([GameMode.STANDARD].includes(gameModeToVanilla(mode))
        ? []
        : [Mods.RELAX2, Mods.SPUN_OUT]
      ).flat(),
      ...([GameMode.MANIA].includes(gameModeToVanilla(mode))
        ? [Mods.RELAX]
        : []
      ).flat(),
      ...(ignoreMods ?? []),
    ];
  }

  return (
    <RoundedContent className={twMerge("rounded-lg bg-card p-4", className)}>
      <ToggleGroup
        type="multiple"
        value={mods ?? undefined}
        className="flex flex-wrap"
        onValueChange={(e) => {
          setMods(e.includes(Mods.NONE) ? [Mods.NONE] : (e as Mods[]));
        }}
      >
        {modElements
          .filter(mod => !ignoreMods?.includes(mod))
          .map(mod => (
            <ToggleGroupItem
              key={mod}
              size={variant === "small" ? "lg" : "xl"}
              value={mod.toString()}
              variant={variant === "small" ? "default" : "outline"}
              className="h-auto p-0 capitalize"
            >
              <ModElement key={mod} modAcronym={ShortenedMods[mod]} variant="leaderboard" />
            </ToggleGroupItem>
          ))}
      </ToggleGroup>
    </RoundedContent>
  );
}
