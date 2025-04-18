import { PPCalculatorDialog } from "@/app/beatmapsets/components/PPCalculatorDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Beatmap, BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BeatmapDropdown({
  beatmapSet,
  beatmap,
}: {
  beatmapSet: BeatmapSet;
  beatmap: Beatmap;
}) {
  const router = useRouter();

  const [includeOpenBanchoButton] = useState(() => {
    return localStorage.getItem("includeOpenBanchoButton") || "false";
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="xl">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PPCalculatorDialog>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            PP Calculator
          </DropdownMenuItem>
        </PPCalculatorDialog>
        {includeOpenBanchoButton == "true" && (
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `https://osu.ppy.sh/beatmapsets/${beatmapSet.id}#osu/${beatmap.id}`
              )
            }
          >
            Open on Bancho
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
