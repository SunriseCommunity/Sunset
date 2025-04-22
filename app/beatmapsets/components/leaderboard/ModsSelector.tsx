import RoundedContent from "@/components/General/RoundedContent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
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
    mod: ShortenedMods.NM,
  },
  {
    element: <Candy />,
    mod: ShortenedMods.EZ,
  },
  {
    element: <LifeBuoy />,
    mod: ShortenedMods.NF,
  },
  {
    element: <Hourglass />,
    mod: ShortenedMods.HT,
  },
  {
    element: <HandMetal />,
    mod: ShortenedMods.HR,
  },
  {
    element: <Skull />,
    mod: ShortenedMods.SD,
  },
  {
    element: <ThumbsUp />,
    mod: ShortenedMods.PF,
  },
  {
    element: <SkipForwardIcon />,
    mod: ShortenedMods.DT,
  },
  {
    element: <Headphones />,
    mod: ShortenedMods.NC,
  },
  {
    element: <Cloudy />,
    mod: ShortenedMods.HD,
  },
  {
    element: <Flashlight />,
    mod: ShortenedMods.FL,
  },
  {
    element: <LoaderPinwheel />,
    mod: ShortenedMods.SO,
  },
  {
    element: <Keyboard />,
    mod: ShortenedMods.AP,
  },
  {
    element: <Star />,
    mod: ShortenedMods.RX,
  },
  {
    element: <Rocket />,
    mod: ShortenedMods.V2,
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
  mods: string[];
  setMods: (mods: string[]) => void;
  mode?: GameMode;
  variant?: "small" | "big";
  ignoreMods?: ShortenedMods[];
  className?: string;
}) {
  if (mode) {
    ignoreMods = [
      ...([GameMode.std].includes(gameModeToVanilla(mode))
        ? []
        : [ShortenedMods.AP, ShortenedMods.SO]
      ).flat(),
      ...([GameMode.mania].includes(gameModeToVanilla(mode))
        ? [ShortenedMods.RX]
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
          setMods(e.includes("0") ? ["0"] : e);
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
