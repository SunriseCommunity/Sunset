import RoundedContent from "@/components/General/RoundedContent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import { GameMode, Mods } from "@/lib/types/api";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import {
  Ban,
  Candy,
  Cloudy,
  Flashlight,
  HandMetal,
  Headphones,
  Hourglass,
  Keyboard,
  LifeBuoy,
  LoaderPinwheel,
  Rocket,
  SkipForwardIcon,
  Skull,
  Star,
  ThumbsUp,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const modElements = [
  {
    element: <Ban />,
    mod: Mods.NONE,
  },
  {
    element: <Candy />,
    mod: Mods.EASY,
  },
  {
    element: <LifeBuoy />,
    mod: Mods.NO_FAIL,
  },
  {
    element: <Hourglass />,
    mod: Mods.HALF_TIME,
  },
  {
    element: <HandMetal />,
    mod: Mods.HARD_ROCK,
  },
  {
    element: <Skull />,
    mod: Mods.SUDDEN_DEATH,
  },
  {
    element: <ThumbsUp />,
    mod: Mods.PERFECT,
  },
  {
    element: <SkipForwardIcon />,
    mod: Mods.DOUBLE_TIME,
  },
  {
    element: <Headphones />,
    mod: Mods.NIGHTCORE,
  },
  {
    element: <Cloudy />,
    mod: Mods.HIDDEN,
  },
  {
    element: <Flashlight />,
    mod: Mods.FLASHLIGHT,
  },
  {
    element: <LoaderPinwheel />,
    mod: Mods.SPUN_OUT,
  },
  {
    element: <Keyboard />,
    mod: Mods.RELAX2,
  },
  {
    element: <Star />,
    mod: Mods.RELAX,
  },
  {
    element: <Rocket />,
    mod: Mods.SCORE_V2,
  },
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
          .filter(({ mod }) => !ignoreMods?.includes(mod))
          .map(({ element, mod }) => (
            <ToggleGroupItem
              key={mod}
              size={variant === "small" ? "lg" : "xl"}
              value={mod.toString()}
              variant={variant === "small" ? "default" : "outline"}
              className="capitalize p-1"
            >
              <div className="items-center flex flex-col">
                {element}
                {ShortenedMods[mod]}
              </div>
            </ToggleGroupItem>
          ))}
      </ToggleGroup>
    </RoundedContent>
  );
}
