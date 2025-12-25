import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PPCalculatorDialog } from "@/app/(website)/beatmapsets/components/PPCalculatorDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, BeatmapSetResponse, GameMode } from "@/lib/types/api";
import { isUserHasBATPrivilege } from "@/lib/utils/userPrivileges.util";

export function BeatmapDropdown({
  // eslint-disable-next-line unused-imports/no-unused-vars -- TODO: Remove?
  beatmapSet,
  beatmap,
  activeMode,
}: {
  beatmapSet: BeatmapSetResponse;
  beatmap: BeatmapResponse;
  activeMode: GameMode;
}) {
  const t = useT("pages.beatmapsets.components.dropdown");
  const { self } = useSelf();

  const [includeOpenBanchoButton] = useState(() => {
    return localStorage.getItem("includeOpenBanchoButton") || "false";
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="xl">
          <span className="sr-only">{t("openMenu")}</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <PPCalculatorDialog beatmap={beatmap} mode={activeMode}>
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            {t("ppCalculator")}
          </DropdownMenuItem>
        </PPCalculatorDialog>
        {includeOpenBanchoButton === "true" && (
          <DropdownMenuItem asChild>
            <Link href={`https://osu.ppy.sh/beatmaps/${beatmap.id}`}>
              {t("openOnBancho")}
            </Link>
          </DropdownMenuItem>
        )}
        {self && isUserHasBATPrivilege(self) && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/beatmapsets/${beatmap.beatmapset_id}`}>
              {t("openWithAdminPanel")}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
