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
import type { StatsSnapshotResponse, StatsSnapshotsResponse } from "@/lib/types/api";
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
    const currentDate = new Date(snapshots[0].saved_at);
    const endDate = new Date();

    let snapshotIndex = 0;

    while (currentDate <= endDate) {
      if (snapshotIndex >= snapshots.length) {
        break;
      }

      const formattedDate = currentDate.toDateString();

      const formattedCurrentDate = new Date(
        snapshots[snapshotIndex].saved_at,
      ).toDateString();

      if (
        snapshotIndex <= snapshots.length
        && formattedDate === formattedCurrentDate
      ) {
        lastValidSnapshot = { ...snapshots[snapshotIndex] };
        result.push(lastValidSnapshot);
      }
      else if (lastValidSnapshot) {
        result.push({ ...lastValidSnapshot, saved_at: formattedDate });
      }

      if (
        new Date(formattedCurrentDate).getTime()
          >= new Date(formattedDate).getTime()
      ) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (
        new Date(formattedCurrentDate).getTime()
          <= new Date(formattedDate).getTime()
      ) {
        snapshotIndex++;
      }
    }

    const isCurrentDay = (n: number) =>
      Math.round((n - Date.now()) / 1000 / (3600 * 24)) === 0;

    const isResultHasCurrentDay = result.some(s =>
      isCurrentDay(new Date(s.saved_at).getTime()),
    );

    if (isResultHasCurrentDay) {
      result.pop();
    }
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

  const isChartReversed = chartValue === "rank";

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
