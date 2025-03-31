import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/hooks/api/types";
import { User } from "@/lib/types/User";
import { UserStats } from "@/lib/types/UserStats";

interface LeaderboardResponse {
  data: {
    users: {
      user: User;
      stats: UserStats;
    }[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getLeaderboard(
  mode: GameMode,
  type: "pp" | "score",
  page?: number,
  limit?: number
): Promise<LeaderboardResponse> {
  const token = await getUsetToken();

  const typeNumber = type === "pp" ? 0 : 1;

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/leaderboard${`?mode=${mode}`}${`&type=${typeNumber}`}${
      page ? `&page=${page}` : ""
    }${limit ? `&limit=${limit}` : ""}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response || response.error) {
    return { data: null, error: response?.error || "Unknown error" };
  }

  return { data: response };
}
