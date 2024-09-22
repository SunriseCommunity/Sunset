import { getUsetToken } from "@/lib/actions/getUserToken";
import { Score } from "@/lib/types/Score";

interface ScoreResponse {
  data: Score | null;
  error?: string;
}

export async function getScore(id: number): Promise<ScoreResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/score/${id}`,

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
