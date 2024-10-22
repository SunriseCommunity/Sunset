import { getUsetToken } from "@/lib/actions/getUserToken";

interface SetBeatmapSetFavouritedResponse {
  error?: string;
}

export async function setBeatmapSetFavourited(
  id: number,
  favourited: boolean
): Promise<SetBeatmapSetFavouritedResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/beatmapset/${id}?favourite=${favourited}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response || response.error) {
    return { error: response?.error || "Unknown error" };
  }

  return {};
}
