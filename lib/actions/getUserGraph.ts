import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/types/GameMode";
import { StatsSnapshot } from "../types/StatsSnapshot";

interface UserGraphResponse {
  data: {
    snapshots: StatsSnapshot[];
    total_count: number;
  } | null;
  error?: string;
}

export async function getUserGraph(
  id: number,
  mode: GameMode
): Promise<UserGraphResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/graph${`?mode=${mode}`}`,
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
