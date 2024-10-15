import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/types/GameMode";
import { PlayedBeatmap } from "../types/PlayedBeatmap";
import { Beatmap } from "../types/Beatmap";
import { BeatmapSet } from "../types/BeatmapSet";

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
    }/user/${id}/favourites${page ? `&page=${page}` : ""}${
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
