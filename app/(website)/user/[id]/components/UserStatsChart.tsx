import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

import { useT } from "@/lib/i18n/utils";
import type {
  StatsSnapshotResponse,
  StatsSnapshotsResponse,
} from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";

interface Props {
  data: StatsSnapshotsResponse;
  value: "pp" | "rank";
}

export default function UserStatsChart({ data, value: chartValue }: Props) {
  const t = useT("pages.user.components.statsChart");
  if (data.snapshots.length === 0)
    return null;

  const snapshots = data.snapshots.filter((snapshot) => {
    if (chartValue === "rank")
      return snapshot.global_rank > 0;

    return Number.isFinite(snapshot.pp) && snapshot.pp >= 0;
  });
  if (snapshots.length === 0)
    return null;

  const currentSnapshot = snapshots.pop();
  if (!currentSnapshot)
    return null;

  let result: StatsSnapshotResponse[] = [];

  if (snapshots.length > 0) {
    snapshots.sort(
      (a, b) => new Date(a.saved_at).getTime() - new Date(b.saved_at).getTime(),
    );

    let lastValidSnapshot: StatsSnapshotResponse | null = null;
    const startDate = new Date(snapshots[0].saved_at);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    let snapshotIndex = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const currentDateStr = currentDate.toDateString();
      let snapshotForThisDay: StatsSnapshotResponse | null = null;

      while (snapshotIndex < snapshots.length) {
        const snapshotDate = new Date(snapshots[snapshotIndex].saved_at);
        snapshotDate.setHours(0, 0, 0, 0);

        if (currentDateStr === snapshotDate.toDateString()) {
          snapshotForThisDay = snapshots[snapshotIndex];
          lastValidSnapshot = { ...snapshots[snapshotIndex] };
          snapshotIndex++;
        }
        else {
          break;
        }
      }

      if (snapshotForThisDay) {
        result.push({ ...snapshotForThisDay });
      }
      else if (snapshotIndex >= snapshots.length && currentSnapshot) {
        result.push({
          ...currentSnapshot,
          saved_at: currentDate.toISOString(),
        });
      }
      else if (lastValidSnapshot) {
        result.push({
          ...lastValidSnapshot,
          saved_at: currentDate.toISOString(),
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastResult = result.at(-1);
  const lastResultDate = lastResult ? new Date(lastResult.saved_at) : null;
  if (lastResultDate) {
    lastResultDate.setHours(0, 0, 0, 0);
  }

  if (lastResultDate && lastResultDate.getTime() === today.getTime()) {
    result.pop();
  }

  result.push(currentSnapshot);

  result = result.slice(-60);

  const chartData = Array.from(result.values()).map((s) => {
    return {
      date: timeSince(s.saved_at, true),
      pp: s.pp,
      rank: s.global_rank,
    };
  });

  const isChartForRank = chartValue === "rank";

  const leewayForDomain = isChartForRank ? 15 : 50;
  const isChartReversed = isChartForRank;

  return (
    <ResponsiveContainer
      width="100%"
      height={120}
      className="h-32 max-h-32 min-h-32"
    >
      <AreaChart data={chartData}>
        <YAxis
          type="number"
          hide
          tickFormatter={(value: number) => {
            return Math.round(value).toFixed(0);
          }}
          reversed={isChartReversed}
          domain={[
            (dataMin: number) => Math.max(0, dataMin - leewayForDomain),
            (dataMax: number) => Math.max(0, dataMax + leewayForDomain),
          ]}
        />

        <Area
          type="stepAfter"
          dataKey={chartValue}
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          fill="transparent"
          baseValue={isChartReversed ? "dataMax" : "dataMin"}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />

        <Tooltip
          formatter={value => [
            t("tooltip", {
              value: Math.round(value as number),
              type: t(`types.${chartValue}`),
            }),
          ]}
          contentStyle={{ color: "#333", borderRadius: "0.5rem" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
