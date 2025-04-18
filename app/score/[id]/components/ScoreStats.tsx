import { Tooltip } from "@/components/Tooltip";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { Score } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
import { isBeatmapRanked } from "@/lib/utils/isBeatmapRanked";

interface Props {
  score: Score;
  beatmap?: Beatmap;
}

export default function ScoreStats({ score, beatmap }: Props) {
  return (
    <div className="flex flex-col text-white space-y-1">
      <div className="grid grid-cols-3 gap-4">
        <DataBox title="Accuracy">
          <p className={score.accuracy === 100 ? "text-primary" : ""}>
            {score.accuracy.toFixed(2)}%
          </p>
        </DataBox>
        <DataBox title="Combo">
          <p
            className={
              score.max_combo === beatmap?.max_combo ? "text-primary" : ""
            }
          >
            {score.max_combo}x
          </p>
        </DataBox>
        <DataBox title="PP">
          {score.performance_points.toFixed(2)}
          {beatmap && !isBeatmapRanked(beatmap) && (
            <Tooltip content={`If ranked`}>
              <span className="text-yellow-500 ml-1">*</span>
            </Tooltip>
          )}
        </DataBox>
      </div>

      <ScoreGamemodeRelatedStats score={score} />
    </div>
  );
}

function ScoreGamemodeRelatedStats({ score }: { score: Score }) {
  if (score.game_mode === GameMode.std) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <DataBox title="Great" value={score.count_300} />
        <DataBox title="Ok" value={score.count_100} />
        <DataBox title="Meh" value={score.count_50} />
        <DataBox title="Miss" value={score.count_miss} />
      </div>
    );
  }

  if (score.game_mode === GameMode.taiko) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <DataBox title="Great" value={score.count_300} />
        <DataBox title="Miss" value={score.count_miss} />
        <DataBox title="Ok" value={score.count_100} />
      </div>
    );
  }

  if (score.game_mode === GameMode.catch) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <DataBox title="Great" value={score.count_300} />
        <DataBox title="Miss" value={score.count_miss} />
        <DataBox title="Large Droplet" value={score.count_100} />
        <DataBox title="Small Droplet" value={score.count_50} />
      </div>
    );
  }

  if (score.game_mode === GameMode.mania) {
    return (
      <div className="grid grid-cols-6 gap-1 text-xs">
        <DataBox title="Perfect" value={score.count_geki} />
        <DataBox title="Great" value={score.count_300} />
        <DataBox title="Good" value={score.count_katu} />
        <DataBox title="Ok" value={score.count_100} />
        <DataBox title="Meh" value={score.count_50} />
        <DataBox title="Miss" value={score.count_miss} />
      </div>
    );
  }
}

function DataBox({
  title,
  value,
  children,
}: {
  title: string;
  value?: string | number;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-card p-2.5 rounded text-center text-card-foreground">
      <p className="text-card-foreground/50">{title}</p>
      <p className="text-base">{value}</p>
      {children}
    </div>
  );
}
