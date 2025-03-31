import { getUsetToken } from "@/lib/actions/getUserToken";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";

export const revalidate = 3600;

interface BeatmapSetResponse {
  data: BeatmapSet | null;
  error?: string;
}

export async function getBeatmapSet(id: number): Promise<BeatmapSetResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/beatmapset/${id}`,
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
