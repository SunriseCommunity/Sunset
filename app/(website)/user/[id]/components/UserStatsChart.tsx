import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
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

  data.snapshots = data.snapshots.filter(
    s => s.country_rank > 0 && s.global_rank > 0,
  );

  const snapshots = [...data.snapshots];

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

      if (snapshotIndex < snapshots.length) {
        const snapshotDate = new Date(snapshots[snapshotIndex].saved_at);
        snapshotDate.setHours(0, 0, 0, 0);
        const snapshotDateStr = snapshotDate.toDateString();

        if (currentDateStr === snapshotDateStr) {
          snapshotForThisDay = snapshots[snapshotIndex];
          lastValidSnapshot = { ...snapshots[snapshotIndex] };
          snapshotIndex++;
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
      height="100%"
      className="h-52 max-h-52 min-h-52"
    >
      <AreaChart data={chartData}>
        <CartesianGrid stroke="" />
        <XAxis
          dataKey="date"
          label={{ value: t("date"), position: "insideBottomRight", offset: 0 }}
          tick={{ transform: "translate(0, 6)" }}
          style={{
            fontSize: "0px",
          }}
        />
        <YAxis
          type="number"
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
          type="monotone"
          dataKey={chartValue}
          stroke="#E0C097"
          fill="#E0C097"
          baseValue={isChartReversed ? "dataMax" : "dataMin"}
          isAnimationActive={false}
        />
        <Legend />

        <Tooltip
          formatter={value => [
            t("tooltip", {
              value: Math.round(value as number),
              type: t(`types.${chartValue}`),
            }),
          ]}
          contentStyle={{ color: "#333" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
