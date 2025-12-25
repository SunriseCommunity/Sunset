import { Megaphone } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  useBeatmapSetAddHype,
  useBeatmapSetHype,
  useGetUserHypes,
} from "@/lib/hooks/api/beatmap/useBeatmapHype";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse } from "@/lib/types/api";

export function BeatmapNomination({ beatmap }: { beatmap: BeatmapResponse }) {
  const t = useT("pages.beatmapsets.components.nomination");
  const { self } = useSelf();

  const { trigger } = useBeatmapSetAddHype(beatmap.beatmapset_id);

  const { toast } = useToast();

  const usersHypeQuery = useGetUserHypes();
  const usersHypeData = usersHypeQuery.data;

  const userHypesLeft = usersHypeData?.quantity ?? 0;

  const handleHype = () => {
    if (userHypesLeft > 0) {
      trigger(null, {
        onSuccess: () => {
          toast({
            title: t("toast.success"),
            variant: "success",
          });
        },
        onError: (err) => {
          toast({
            title: t("toast.error"),
            description: err.message ?? t("toast.error"),
            variant: "destructive",
          });
        },
      });
    }
  };

  const beatmapsetQuery = useBeatmapSetHype(beatmap.beatmapset_id);
  const beatmapsetData = beatmapsetQuery.data;

  const { current_hypes, required_hypes } = beatmapsetData ?? {
    current_hypes: 0,
    required_hypes: 3,
  };

  return (
    <div className="flex h-full flex-col lg:col-span-2">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-light">{t.rich("description")}</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("hypeProgress")}
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
                // eslint-disable-next-line @eslint-react/no-array-index-key -- expected
                key={`hype-divider-${i}`}
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
              <Megaphone className="size-5" />
              {t("hypeBeatmap")}
            </Button>

            {self && (
              <div className="text-right text-xs font-light">
                <p className="text-secondary-foreground">
                  {t.rich("hypesRemaining", {
                    b: (chunks: ReactNode) => (
                      <b className="font-bold text-primary">{chunks}</b>
                    ),
                    count: userHypesLeft,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
