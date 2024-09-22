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

export async function getUserScores(
  id: number,
  mode: GameMode,
  type: "recent" | "top" | "best",
  page?: number,
  limit?: number
): Promise<UserScoresResponse> {
  const token = await getUsetToken();

  const typeNumber = type === "best" ? 0 : type === "recent" ? 1 : 2;

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/scores${`?mode=${mode}`}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }${`&type=${typeNumber}`}`,
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
