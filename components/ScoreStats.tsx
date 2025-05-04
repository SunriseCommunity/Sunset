import { Tooltip } from "@/components/Tooltip";
import { Separator } from "@/components/ui/separator";
import { BeatmapResponse, GameMode, ScoreResponse } from "@/lib/types/api";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";
import numberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";
import { twMerge } from "tailwind-merge";

interface Props {
  score: ScoreResponse;
  variant: scoreStatsVariant;
  beatmap?: BeatmapResponse;
}

type scoreStatsVariant = "score" | "leaderboard";

export default function ScoreStats({ score, beatmap, variant }: Props) {
  return (
    <div className="flex flex-col text-white space-y-1">
      <div
        className={twMerge(
          "grid grid-cols-3 gap-4 ",
          variant === "leaderboard"
            ? "grid-cols-4 text-xs sm:text-base"
            : "grid-cols-3"
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
          {beatmap && !isBeatmapRanked(beatmap) && (
            <Tooltip content={`If ranked`}>
              <span className="text-yellow-500 ml-1">*</span>
            </Tooltip>
          )}
        </DataBox>
      </div>

      <div
        className={twMerge(
          variant === "leaderboard"
            ? "flex flex-col place-content-between md:flex-row md:gap-4"
            : ""
        )}
      >
        <ScoreGamemodeRelatedStats score={score} variant={variant} />

        {variant === "leaderboard" && (
          <div className="grid grid-cols-2 gap-4">
            <DataBox title="Time" variant={variant}>
              <Tooltip content={toPrettyDate(score.when_played, true)}>
                {timeSince(score.when_played, undefined, true)}
              </Tooltip>
            </DataBox>
            <DataBox title="Mods" variant={variant} value={score.mods ?? ""} />
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreGamemodeRelatedStats({
  score,
  variant,
}: {
  score: ScoreResponse;
  variant: scoreStatsVariant;
}) {
  if (score.game_mode === GameMode.STANDARD) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        <DataBox title="Meh" value={score.count_50} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
      </div>
    );
  }

  if (score.game_mode === GameMode.TAIKO) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
      </div>
    );
  }

  if (score.game_mode === GameMode.CATCH_THE_BEAT) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
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
      </div>
    );
  }

  if (score.game_mode === GameMode.MANIA) {
    return (
      <div className="grid grid-cols-6 gap-1 text-xs">
        <DataBox title="Perfect" value={score.count_geki} variant={variant} />
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Good" value={score.count_katu} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        <DataBox title="Meh" value={score.count_50} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
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
        variant === "score" ? "bg-card p-2.5" : ""
      )}
    >
      <p className="text-card-foreground/50">{title}</p>
      <p className="text-base">{value}</p>
      {children}
    </div>
  );
}
