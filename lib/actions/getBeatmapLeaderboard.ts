import { getUsetToken } from "@/lib/actions/getUserToken";
import { Score } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";

interface BeatmapLeaderboardResponse {
  data: {
    scores: Score[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getBeatmapLeaderboard(
  beatmapId: number,
  mode: GameMode,
  mods?: number,
  limit?: number
): Promise<BeatmapLeaderboardResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/beatmap/${beatmapId}/leaderboard${`?mode=${mode}`}${
      mods ? `&mods=${mods}` : ""
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
