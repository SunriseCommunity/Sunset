import { getUsetToken } from "@/lib/actions/getUserToken";
import { BeatmapSet } from "@/lib/hooks/api/beatmap/types";

interface UserFavouritesResponse {
  data: {
    sets: BeatmapSet[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getUserFavourites(
  id: number,
  page?: number,
  limit?: number
): Promise<UserFavouritesResponse> {
  const token = await getUsetToken();
  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/favourites${`?page=${page ?? 1}`}${
      limit ? `&limit=${limit}` : ""
    }`,
    {
      headers: {
        "Cache-Control": "no-cache",
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
