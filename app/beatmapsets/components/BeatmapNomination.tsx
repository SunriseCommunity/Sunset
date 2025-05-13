import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useBeatmapSetAddHype,
  useBeatmapSetHype,
  useGetUserHypes,
} from "@/lib/hooks/api/beatmap/useBeatmapHype";
import useSelf from "@/lib/hooks/useSelf";
import { BeatmapResponse } from "@/lib/types/api";
import { Megaphone } from "lucide-react";

export function BeatmapNomination({ beatmap }: { beatmap: BeatmapResponse }) {
  const { self } = useSelf();

  const { trigger } = useBeatmapSetAddHype(beatmap.beatmapset_id);

  const usersHypeQuery = useGetUserHypes();
  const usersHypeData = usersHypeQuery.data;

  const userHypesLeft = usersHypeData?.quantity ?? 0;

  const handleHype = () => {
    if (userHypesLeft > 0) {
      trigger();
    }
  };

  const beatmapsetQuery = useBeatmapSetHype(beatmap.beatmapset_id);
  const beatmapsetData = beatmapsetQuery.data;

  const { current_hypes, required_hypes } = beatmapsetData ?? {
    current_hypes: 0,
    required_hypes: 3,
  };

  return (
    <div className="flex flex-col lg:col-span-2 h-full">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-light">
          Hype this map if you enjoyed playing it to help it progress to{" "}
          <b className="font-bold">Ranked</b> status.
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Hype progress
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {current_hypes}/{required_hypes}
            </span>
          </div>

          <div className="relative h-3">
            <Progress
              value={Math.min((current_hypes / required_hypes) * 100, 100)}
              className="h-3"
            />

            {Array.from({ length: required_hypes }).map((_, i) => (
              <div
                key={i}
                className={`absolute top-0 h-3 w-0.5 bg-accent ${
                  i === 0 ? "hidden" : ""
                }`}
                style={{ left: `${(i / required_hypes) * 100}%` }}
              />
            ))}
          </div>

          <div className="flex flex-col justify-start gap-2">
            <Button
              onClick={handleHype}
              disabled={!self || userHypesLeft <= 0}
              variant="secondary"
            >
              <Megaphone className="h-5 w-5" />
              Hype beatmap!
            </Button>

            {self && (
              <div className="text-right text-xs font-light">
                <p className="text-secondary-foreground">
                  You have
                  <span className="text-primary font-bold">
                    {" "}
                    {userHypesLeft} hypes{" "}
                  </span>
                  remaining for this week
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
