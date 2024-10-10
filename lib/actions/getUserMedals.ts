import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/types/GameMode";
import { UserMedals } from "../types/UserMedals";

interface UserMedalsResponse {
  data: UserMedals | null;
  error?: string;
}

export async function getUserMedals(
  id: number,
  mode: GameMode
): Promise<UserMedalsResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/${id}/medals${`?mode=${mode}`}`,
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
