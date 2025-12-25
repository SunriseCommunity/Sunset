import { Progress } from "@/components/ui/progress";
import { getLevelWithProgress } from "@/lib/utils/userLevel";

const levelTiersColors = {
  0: {
    from: "#bab3ab",
    to: "#bab3ab",
  },
  20: {
    from: "#b88f7a",
    to: "#855c47",
  },
  40: {
    from: "#e0e0eb",
    to: "#a3a3c2",
  },
  60: {
    from: "#f0e4a8",
    to: "#e0c952",
  },
  80: {
    from: "#a8f0ef",
    to: "#52e0df",
  },
  100: {
    from: "#d9f8d3",
    to: "#a0cf96",
  },
  105: {
    from: "#97dcff",
    to: "#ed82ff",
  },
  110: {
    from: "#ffe600",
    to: "#ed82ff",
  },
};

function getTierColors(level: number) {
  const tiers = Object.keys(levelTiersColors)
    .map(Number)
    .sort((a, b) => a - b);

  const applicableTier = tiers.reduce(
    (prev, curr) => (curr <= level ? curr : prev),
    0,
  );
  return levelTiersColors[applicableTier as keyof typeof levelTiersColors];
}

export function UserLevelProgress({ totalScore }: { totalScore: number }) {
  const userLevel = getLevelWithProgress(BigInt(totalScore));
  const currentLevelProgress = (userLevel - Math.floor(userLevel)) * 100;

  const { from, to } = getTierColors(userLevel);

  return (
    <div className={`flex items-center gap-2 `}>
      <div className="w-full space-y-1">
        <div className="flex items-center">
          <h3 className="flex-grow text-sm ">Level</h3>
          <span className="text-xs font-medium text-current">
            {Math.floor(currentLevelProgress)}%
          </span>
        </div>

        <Progress value={currentLevelProgress} className="h-3 bg-card" />
      </div>

      <div className="relative flex size-10 items-center justify-center bg-transparent ">
        <svg viewBox="0 0 100 100" className="size-12">
          <defs>
            <linearGradient
              id="gradientStroke"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>

          <polygon
            points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
            fill={to}
            stroke="url(#gradientStroke)"
            fillOpacity={0.5}
            strokeWidth="8"
          />

          <polygon
            points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
            fill="#000000"
            fillOpacity={0.3}
          />

          <text
            x="50"
            y="55"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="32"
            fontWeight="bold"
          >
            {Math.floor(userLevel)}
          </text>
        </svg>
      </div>
    </div>
  );
}
