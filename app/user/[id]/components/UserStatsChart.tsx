import { StatsSnapshot } from "@/lib/hooks/api/user/types";
import { timeSince } from "@/lib/utils/timeSince";
import {
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: {
    snapshots: StatsSnapshot[];
    total_count: number;
  };
  value: "pp" | "rank";
}

export default function UserStatsChart({ data, value: chartValue }: Props) {
  if (data.snapshots.length === 0) return null;

  data.snapshots = data.snapshots.filter(
    (s) => s.country_rank > 0 && s.global_rank > 0
  );

  const snapshots = [...data.snapshots];

  var currentSnapshot = snapshots.pop();
  if (!currentSnapshot) return null;

  var result: StatsSnapshot[] = [];

  if (snapshots.length > 0) {
    snapshots.sort(
      (a, b) => new Date(a.saved_at).getTime() - new Date(b.saved_at).getTime()
    );

    let lastValidSnapshot: StatsSnapshot | null = null;
    let currentDate = new Date(snapshots[0].saved_at);
    const endDate = new Date();

    let snapshotIndex = 0;

    while (currentDate <= endDate) {
      if (snapshotIndex >= snapshots.length) {
        break;
      }

      let formattedDate = currentDate.toDateString();

      const formattedCurrentDate = new Date(
        snapshots[snapshotIndex].saved_at
      ).toDateString();

      if (
        snapshotIndex <= snapshots.length &&
        formattedDate === formattedCurrentDate
      ) {
        lastValidSnapshot = { ...snapshots[snapshotIndex] };
        result.push(lastValidSnapshot);
      } else if (lastValidSnapshot) {
        result.push({ ...lastValidSnapshot, saved_at: formattedDate });
      }

      if (
        new Date(formattedCurrentDate).getTime() >=
        new Date(formattedDate).getTime()
      ) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (
        new Date(formattedCurrentDate).getTime() <=
        new Date(formattedDate).getTime()
      ) {
        snapshotIndex++;
      }
    }

    var isCurrentDay = (n: number) =>
      Math.round((n - Date.now()) / 1000 / (3600 * 24)) === 0;

    var isResultHasCurrentDay = result.some((s) =>
      isCurrentDay(new Date(s.saved_at).getTime())
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

  const isChartReversed = chartValue == "rank";

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="min-h-52 h-52 max-h-52"
    >
      <AreaChart data={chartData}>
        <CartesianGrid stroke="" />
        <XAxis
          dataKey="date"
          label={{ value: "Date", position: "insideBottomRight", offset: 0 }}
          tick={{ transform: "translate(0, 6)" }}
          style={{
            fontSize: "0px",
          }}
        />
        <YAxis
          type="number"
          tickFormatter={(value: number, index: number) => {
            return Math.round(value).toFixed();
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
          formatter={(value) => [
            `${Math.round(value as number)} ${chartValue}`,
          ]}
          contentStyle={{ color: "#333" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
