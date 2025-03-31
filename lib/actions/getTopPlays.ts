import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/hooks/api/types";
import { Score } from "@/lib/hooks/api/score/types";

interface TopPlaysResponse {
  data: {
    scores: Score[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getTopPlays(
  mode: GameMode,
  page?: number,
  limit?: number
): Promise<TopPlaysResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/score/top${`?mode=${mode}`}
    ${page ? `&page=${page}` : ""}${limit ? `&limit=${limit}` : ""}`,

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
