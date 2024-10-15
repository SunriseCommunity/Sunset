import { StatsSnapshot } from "@/lib/types/StatsSnapshot";
import { timeSince } from "@/lib/utils/timeSince";
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
  let snapshots = data.snapshots.sort((a, b) => {
    return a.saved_at.localeCompare(b.saved_at);
  });

  const dateMap = new Map<string, StatsSnapshot>();
  snapshots.forEach((s, i) => {
    s.saved_at = new Date(new Date(s.saved_at).valueOf()).toISOString();

    if (i === 0) {
      dateMap.set(new Date(s.saved_at).toDateString(), s);
      return;
    }

    const currentDate = new Date(s.saved_at).toDateString();
    const previous = dateMap.get(currentDate);

    if (previous && previous.saved_at > s.saved_at) return;

    dateMap.set(currentDate, s);
  });

  const chartData = Array.from(dateMap.values()).map((s) => {
    return {
      date:
        new Date(s.saved_at).toDateString() === new Date().toDateString()
          ? "Today"
          : timeSince(new Date(s.saved_at), true)!,
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
