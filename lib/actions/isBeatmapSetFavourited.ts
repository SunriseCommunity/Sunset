import { getUsetToken } from "@/lib/actions/getUserToken";

interface IsBeatmapSetFavouritedResponse {
  data: {
    favourited: boolean;
  } | null;
  error?: string;
}

export async function isBeatmapSetFavourited(
  id: number
): Promise<IsBeatmapSetFavouritedResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/beatmapset/${id}/favourited`,
    {
      headers: {
        "Cache-Control": "no-cache", // TEMP FIX: Backend should get proper cache validation headers
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
