import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/types/GameMode";

export interface UserGradesResponse {
  grades: {
    count_xh: number,
    count_x: number,
    count_sh: number,
    count_s: number,
    count_a: number,
    count_b: number,
    count_c: number,
    count_d: number,
  } | null;
  error?: string;
}

export async function getUserGrades(
  id: number,
  mode: GameMode
): Promise<UserGradesResponse> {
  const token = await getUsetToken();
  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/grades?mode=${mode}`,
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
    return { grades: null, error: response?.error || "Unknown error" };
  }

  return { grades: response };
}
