import { Score } from "@/lib/types/Score";
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
    scores: Score[];
    total_count: number;
  };
}

// TODO: Will be reworked to use snapshots.
// NOTE: Currently is unstable if user has more than 100 scores

const bonusNumber = 416.6667;

export default function UserScoresChart({ data }: Props) {
  const scores = data.scores.sort((a, b) => {
    return a.when_played.localeCompare(b.when_played);
  });

  const perfomance = scores.map((s, i) => {
    const scoresAtThatTime = scores
      .slice(0, i + 1)
      .sort((a, b) => b.performance_points - a.performance_points);

    let weightedPp = scoresAtThatTime
      .map((s) => s.performance_points)
      .reduce((acc, pp, index) => acc + Math.pow(0.95, index) * pp, 0);

    let bonusPp = bonusNumber * (1 - Math.pow(0.9994, i));

    return {
      date: s.when_played,
      pp: weightedPp + bonusPp,
    };
  });

  const perfomanceByDays = perfomance.reduce((acc, score) => {
    const date = new Date(score.date).toLocaleDateString();

    if (acc[date] && acc[date] > score.pp) {
      return acc;
    }

    acc[date] = score.pp;
    return acc;
  }, {} as Record<string, number>);

  const perfomanceByDaysMap = Object.entries(perfomanceByDays)
    .map(([date, pp]) => ({
      date,
      pp,
    }))
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  if (perfomanceByDaysMap.length === 0) {
    return null;
  }

  const oldestDate = new Date(perfomanceByDaysMap[0].date);
  const newestDate = new Date(new Date().toLocaleDateString());

  const result = [];
  let lastPP = null;
  let currentDate = new Date(oldestDate);

  while (currentDate <= newestDate) {
    const currentDateStr = currentDate;

    const existingEntry = perfomanceByDaysMap.find(
      (d) => d.date === currentDateStr.toLocaleDateString()
    );

    if (existingEntry) {
      lastPP = existingEntry.pp;
      result.push({
        date: timeSince(currentDate, true),
        pp: lastPP,
      });
    } else if (lastPP !== null) {
      result.push({
        date: timeSince(currentDate, true),
        pp: lastPP,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={result}>
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
