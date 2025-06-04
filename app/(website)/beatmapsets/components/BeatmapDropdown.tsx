import { PPCalculatorDialog } from "@/app/(website)/beatmapsets/components/PPCalculatorDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import useSelf from "@/lib/hooks/useSelf";
import { BeatmapResponse, BeatmapSetResponse, GameMode } from "@/lib/types/api";
import { isUserCanUseAdminPanel } from "@/lib/utils/isUserCanUseAdminPanel";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BeatmapDropdown({
  beatmapSet,
  beatmap,
  activeMode,
}: {
  beatmapSet: BeatmapSetResponse;
  beatmap: BeatmapResponse;
  activeMode: GameMode;
}) {
  const { self } = useSelf();

  const [includeOpenBanchoButton] = useState(() => {
    return localStorage.getItem("includeOpenBanchoButton") || "false";
  });

  return (
    <DropdownMenu modal={false}>
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
        {self && isUserCanUseAdminPanel(self) && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/beatmapsets/${beatmap.beatmapset_id}`}>
              Open with Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
