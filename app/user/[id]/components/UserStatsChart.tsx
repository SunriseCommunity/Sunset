import { StatsSnapshot } from "@/lib/types/StatsSnapshot";
import { timeSince } from "@/lib/utils/timeSince";
import { toLocalTime } from "@/lib/utils/toLocalTime";
import {
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    snapshots: StatsSnapshot[];
    total_count: number;
  };
}

export default function UserStatsChart({ data }: Props) {
  if (data.snapshots.length === 0) return null;

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
      const formattedDate = currentDate.toDateString();

      if (snapshotIndex >= snapshots.length) {
        break;
      }

      const formattedCurrentDate = new Date(
        snapshots[snapshotIndex].saved_at
      ).toDateString();

      if (
        snapshotIndex <= snapshots.length &&
        formattedDate === formattedCurrentDate
      ) {
        lastValidSnapshot = { ...snapshots[snapshotIndex] };
        result.push(lastValidSnapshot);
        snapshotIndex++;
      } else if (lastValidSnapshot) {
        result.push({ ...lastValidSnapshot, saved_at: formattedDate });
      }

      currentDate.setDate(currentDate.getDate() + 1);
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

  return (
    <ResponsiveContainer width="100%" height="100%">
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
        <YAxis />
        <Tooltip
          formatter={(value) => [`${Math.round(value as number)} pp`]}
          contentStyle={{ color: "#333" }}
        />
        <Area
          type="monotone"
          dataKey="pp"
          stroke="#E0C097"
          fill="#E0C097"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
