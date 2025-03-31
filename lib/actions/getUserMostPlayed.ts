import { getUsetToken } from "@/lib/actions/getUserToken";
import { PlayedBeatmap } from "@/lib/hooks/api/beatmap/types";
import { GameMode } from "@/lib/hooks/api/types";

interface UserScoresResponse {
  data: {
    most_played: PlayedBeatmap[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getUserMostPlayed(
  id: number,
  mode: GameMode,
  page?: number,
  limit?: number
): Promise<UserScoresResponse> {
  const token = await getUsetToken();
  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/mostplayed${`?mode=${mode}`}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }`,
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
