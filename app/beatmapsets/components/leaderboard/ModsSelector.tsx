import RoundedContent from "@/components/General/RoundedContent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import {
  Ban,
  Candy,
  Cloudy,
  DoorClosed,
  Flashlight,
  FolderClosed,
  HandMetal,
  Headphones,
  Hourglass,
  LifeBuoy,
  SkipForwardIcon,
  Skull,
  ThumbsUp,
} from "lucide-react";

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
];

export function ModsSelector({
  mods,
  setMods,
}: {
  mods: string[];
  setMods: (mods: string[]) => void;
}) {
  return (
    <RoundedContent className="rounded-lg bg-card p-4">
      <ToggleGroup
        type="multiple"
        value={mods ?? undefined}
        className="flex flex-wrap"
        onValueChange={(e) => {
          setMods(e.includes("0") ? ["0"] : e);
        }}
      >
        {modElements.map(({ element, mod }) => (
          <ToggleGroupItem
            key={mod}
            size="lg"
            value={mod.toString()}
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
