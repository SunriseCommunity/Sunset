import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import fetcher from "@/lib/services/fetcher";
import {
  BeatmapResponse,
  GameMode,
  Mods,
  PerformanceAttributes,
} from "@/lib/types/api";
import { useEffect, useState } from "react";

export function BeatmapPerformanceTooltip({
  beatmap,
}: {
  beatmap: BeatmapResponse;
}) {
  const gamerule = [Mods.NONE];

  if (beatmap.mode != GameMode.MANIA && !gamerule.includes(Mods.RELAX)) {
    gamerule.push(Mods.RELAX);
  }

  if (beatmap.mode == GameMode.STANDARD && !gamerule.includes(Mods.RELAX2)) {
    gamerule.push(Mods.RELAX2);
  }

  const performance = [
    Mods.NONE,
    Mods.HIDDEN,
    Mods.HARD_ROCK,
    Mods.DOUBLE_TIME,
  ];

  const [currentGamerule, setCurrentGamerule] = useState(Mods.NONE);
  const [beatmapPerformances, setBeatmapPerformances] = useState<
    PerformanceAttributes[]
  >([]);

  const fetchData = async (force?: boolean) => {
    if (beatmapPerformances.length > 0 && !force) return;

    const results = await Promise.all(
      performance.map((acc) => {
        return fetcher<PerformanceAttributes>(
          `beatmap/${beatmap.id}/pp?mods=${acc}&mods=${currentGamerule}`
        );
      })
    );

    setBeatmapPerformances(results);
  };

  useEffect(() => {
    if (beatmapPerformances.length == 0) return;

    fetchData(true);
  }, [currentGamerule]);

  return (
    <Tooltip
      onOpenChange={fetchData}
      content={
        <div className="flex gap-2 flex-col">
          <div className="flex gap-1 flex-col">
            {beatmapPerformances.map((pp, i) => {
              return (
                <Badge
                  variant="outline"
                  className="place-content-between gap-1"
                  key={i}
                >
                  <span>
                    {ShortenedMods[performance[i]]} {100}%
                  </span>
                  <span> - </span>
                  <span>{pp?.pp.toFixed(2)}pp</span>
                </Badge>
              );
            })}
          </div>
          <div className="flex place-content-between">
            {gamerule.map((rule, i) => (
              <Button
                variant={currentGamerule === rule ? "secondary" : "outline"}
                onClick={() => setCurrentGamerule(rule)}
                size="sm"
                key={i}
              >
                {ShortenedMods[rule]}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      <Badge
        variant="outline"
        className="rounded-full w-8 h-8 flex items-center justify-center text-sm"
      >
        PP
      </Badge>
    </Tooltip>
  );
}
