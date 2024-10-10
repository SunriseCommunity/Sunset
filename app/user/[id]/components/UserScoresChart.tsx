import { Score } from "@/lib/types/Score";
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

  snapshots = snapshots.filter((s, i) => {
    if (i === 0) {
      return true;
    }

    const prevDate = new Date(snapshots[i - 1].saved_at);
    const currentDate = new Date(s.saved_at);

    return prevDate.toLocaleDateString() !== currentDate.toLocaleDateString();
  });

  const chartData = snapshots.map((s) => ({
    date:
      new Date(s.saved_at).getDate() === new Date().getDate()
        ? "Today"
        : timeSince(new Date(s.saved_at), true),
    pp: s.pp,
    rank: s.global_rank,
  }));

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
