import { PPCalculatorDialog } from "@/app/beatmapsets/components/PPCalculatorDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Beatmap, BeatmapSet } from "@/lib/hooks/api/beatmap/types";
import { GameMode } from "@/lib/hooks/api/types";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BeatmapDropdown({
  beatmapSet,
  beatmap,
  activeMode,
}: {
  beatmapSet: BeatmapSet;
  beatmap: Beatmap;
  activeMode: GameMode;
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
        <PPCalculatorDialog beatmap={beatmap} mode={activeMode}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            PP Calculator
          </DropdownMenuItem>
        </PPCalculatorDialog>
        {includeOpenBanchoButton == "true" && (
          <DropdownMenuItem asChild>
            <Link href={`https://osu.ppy.sh/beatmaps/${beatmap.id}`}>
              Open on Bancho
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
