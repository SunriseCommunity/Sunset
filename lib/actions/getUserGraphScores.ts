import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/types/GameMode";
import { Score } from "@/lib/types/Score";

interface UserScoresResponse {
  data: {
    scores: Score[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getUserGraphScores(
  id: number,
  mode: GameMode
): Promise<UserScoresResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/graph/scores${`?mode=${mode}`}`,
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
