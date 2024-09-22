import { getUsetToken } from "@/lib/actions/getUserToken";
import { Beatmap } from "@/lib/types/Beatmap";

export const revalidate = 3600;

interface BeatmapResponse {
  data: Beatmap | null;
  error?: string;
}

export async function getBeatmap(id: number): Promise<BeatmapResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/beatmap/${id}`,
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
