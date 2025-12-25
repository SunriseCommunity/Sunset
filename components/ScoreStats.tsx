import { twMerge } from "tailwind-merge";

import { Tooltip } from "@/components/Tooltip";
import type { BeatmapResponse, ScoreResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import numberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";

interface Props {
  score: ScoreResponse;
  variant: scoreStatsVariant;
  beatmap?: BeatmapResponse;
}

type scoreStatsVariant = "score" | "leaderboard";

export default function ScoreStats({ score, beatmap, variant }: Props) {
  return (
    <div className="flex flex-col space-y-1 text-white">
      <div
        className={twMerge(
          "grid grid-cols-3 gap-1 ",
          variant === "leaderboard"
            ? "grid-cols-4 text-base"
            : "grid-cols-3",
        )}
      >
        {variant === "leaderboard" && (
          <DataBox title="Score" variant={variant}>
            {numberWith(score.total_score, ",")}
          </DataBox>
        )}

        <DataBox title="Accuracy" variant={variant}>
          <p className={score.accuracy === 100 ? "text-primary" : ""}>
            {score.accuracy.toFixed(2)}%
          </p>
        </DataBox>
        <DataBox title="Combo" variant={variant}>
          <p
            className={
              score.max_combo === beatmap?.max_combo ? "text-primary" : ""
            }
          >
            {score.max_combo}x
          </p>
        </DataBox>
        <DataBox title="PP" variant={variant}>
          {score.performance_points.toFixed(2)}
          {beatmap && !beatmap.is_ranked && (
            <Tooltip content="If ranked">
              <span className="ml-1 text-yellow-500">*</span>
            </Tooltip>
          )}
        </DataBox>
      </div>

      <div
        className={twMerge(
          variant === "leaderboard"
            ? "flex flex-col place-content-between md:flex-row md:gap-2"
            : "",
        )}
      >
        <ScoreGamemodeRelatedStats score={score} variant={variant}>
          {variant === "leaderboard" && (
            <DataBox title="Time" variant={variant}>
              <Tooltip content={toPrettyDate(score.when_played, true)} className="text-base">
                {timeSince(score.when_played, undefined, true)}
              </Tooltip>
            </DataBox>
          )}
          {variant === "leaderboard" && (
            <DataBox title="Mods" variant={variant} value={score.mods ?? ""} />
          )}
        </ScoreGamemodeRelatedStats>
      </div>
    </div>
  );
}

function ScoreGamemodeRelatedStats({
  score,
  variant,
  children,
}: {
  score: ScoreResponse;
  variant: scoreStatsVariant;
  children: React.ReactNode;
}) {
  if (score.game_mode === GameMode.STANDARD) {
    return (
      <div
        className={twMerge(
          "grid gap-1",
          variant === "leaderboard"
            ? "md:grid-cols-6 grid-cols-4"
            : "grid-cols-4",
        )}
      >
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        <DataBox title="Meh" value={score.count_50} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        {children}
      </div>
    );
  }

  if (score.game_mode === GameMode.TAIKO) {
    return (
      <div
        className={twMerge(
          "grid gap-1",
          variant === "leaderboard"
            ? "md:grid-cols-5 grid-cols-3"
            : "grid-cols-3",
        )}
      >
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        {children}
      </div>
    );
  }

  if (score.game_mode === GameMode.CATCH_THE_BEAT) {
    return (
      <div className="">
        <div
          className={twMerge(
            "grid gap-1",
            variant === "leaderboard"
              ? "md:grid-cols-6 grid-cols-4"
              : "grid-cols-4",
          )}
        />
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        <DataBox
          title="Large Droplet"
          value={score.count_100}
          variant={variant}
        />
        <DataBox
          title="Small Droplet"
          value={score.count_50}
          variant={variant}
        />
        {children}
      </div>
    );
  }

  if (score.game_mode === GameMode.MANIA) {
    return (
      <div
        className={twMerge(
          "grid gap-1",
          variant === "leaderboard"
            ? "md:grid-cols-8 grid-cols-6"
            : "grid-cols-6",
        )}
      >
        <DataBox title="Perfect" value={score.count_geki} variant={variant} />
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Good" value={score.count_katu} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        <DataBox title="Meh" value={score.count_50} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        {children}
      </div>
    );
  }
}

function DataBox({
  title,
  variant,
  value,
  children,
}: {
  title: string;
  variant: scoreStatsVariant;
  value?: string | number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        " rounded text-center text-card-foreground",
        variant === "score" ? " bg-card p-2" : "p-1",
      )}
    >
      <p className="text-sm text-card-foreground/50 sm:text-base">{title}</p>
      <p className="text-base">{value}</p>
      {children}
    </div>
  );
}
