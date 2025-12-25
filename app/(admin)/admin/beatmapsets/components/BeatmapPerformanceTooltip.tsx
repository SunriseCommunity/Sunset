import { useCallback, useEffect, useMemo, useState } from "react";

import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import fetcher from "@/lib/services/fetcher";
import type {
  BeatmapResponse,
  PerformanceAttributes,
} from "@/lib/types/api";
import {
  GameMode,
  Mods,
} from "@/lib/types/api";

export function BeatmapPerformanceTooltip({
  beatmap,
}: {
  beatmap: BeatmapResponse;
}) {
  const gamerule = [Mods.NONE];

  if (beatmap.mode !== GameMode.MANIA && !gamerule.includes(Mods.RELAX)) {
    gamerule.push(Mods.RELAX);
  }

  if (beatmap.mode === GameMode.STANDARD && !gamerule.includes(Mods.RELAX2)) {
    gamerule.push(Mods.RELAX2);
  }

  const performance = useMemo(() => [
    Mods.NONE,
    Mods.HIDDEN,
    Mods.HARD_ROCK,
    Mods.DOUBLE_TIME,
  ], []);

  const [currentGamerule, setCurrentGamerule] = useState(Mods.NONE);
  const [beatmapPerformances, setBeatmapPerformances] = useState<
    PerformanceAttributes[]
  >([]);

  const fetchData = useCallback(async (force?: boolean) => {
    if (beatmapPerformances.length > 0 && !force)
      return;

    const results = await Promise.all(
      performance.map((acc) => {
        return fetcher<PerformanceAttributes>(
          `beatmap/${beatmap.id}/pp?mods=${acc}&mods=${currentGamerule}`,
        );
      }),
    );

    setBeatmapPerformances(results);
  }, [beatmap.id, beatmapPerformances.length, currentGamerule, performance]);

  useEffect(() => {
    if (beatmapPerformances.length === 0)
      return;

    fetchData(true);
  }, [beatmapPerformances.length, currentGamerule, fetchData]);

  return (
    <Tooltip
      onOpenChange={fetchData}
      content={(
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            {beatmapPerformances.length > 0 ? (
              beatmapPerformances.map((pp, i) => {
                return (
                  <Badge
                    variant="outline"
                    className="place-content-between gap-1"
                    // eslint-disable-next-line @eslint-react/no-array-index-key -- pp is not sufficiently unique
                    key={`beatmap-performance-tooltip-${pp}-${i}`}
                  >
                    <span>
                      {ShortenedMods[performance[i]]} {100}%
                    </span>
                    <span> - </span>
                    <span>{pp?.pp.toFixed(2)}pp</span>
                  </Badge>
                );
              })
            ) : (
              <EosIconsThreeDotsLoading className="mx-auto size-6" />
            )}
          </div>
          <div className="flex place-content-between gap-2">
            {gamerule.map(rule => (
              <Button
                variant={currentGamerule === rule ? "secondary" : "outline"}
                onClick={() => setCurrentGamerule(rule)}
                size="sm"
                key={`beatmap-performance-tooltip-gamerule-${rule}`}
              >
                {ShortenedMods[rule]}
              </Button>
            ))}
          </div>
        </div>
      )}
    >
      <Badge
        variant="outline"
        className="flex size-8 items-center justify-center rounded-full text-sm"
      >
        PP
      </Badge>
    </Tooltip>
  );
}
