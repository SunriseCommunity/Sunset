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

const timezoneOffset = new Date().getTimezoneOffset() * 60000;

export default function UserStatsChart({ data }: Props) {
  if (data.snapshots.length === 0) return null;

  let snapshots = data.snapshots.sort((a, b) => {
    return a.saved_at.localeCompare(b.saved_at);
  });

  let firstDate = new Date(snapshots[0].saved_at);
  let lastDate = new Date(snapshots[snapshots.length - 1].saved_at);

  for (
    let d = new Date(firstDate.valueOf() + timezoneOffset);
    d < lastDate;
    d.setDate(d.getDate() + 1)
  ) {
    if (
      !snapshots.find(
        (s) => new Date(s.saved_at).toDateString() === d.toDateString()
      )
    ) {
      const snapshotBefore = snapshots.find(
        (s) =>
          new Date(s.saved_at).toDateString() ===
          new Date(d.valueOf() - 86400000).toDateString()
      );

      snapshots.push({
        country_rank: snapshotBefore?.country_rank ?? 0,
        global_rank: snapshotBefore?.global_rank ?? 0,
        pp: snapshotBefore?.pp ?? 0,
        saved_at: d.toISOString(),
      });
    }
  }

  snapshots = snapshots.sort((a, b) => {
    return a.saved_at.localeCompare(b.saved_at);
  });

  if (snapshots.length > 70) {
    snapshots = snapshots.slice(snapshots.length - 70);
  }

  const dateMap = new Map<string, StatsSnapshot>();
  snapshots.forEach((s, i) => {
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
      date: timeSince(new Date(new Date(s.saved_at).valueOf()), true),
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
