import { getUsetToken } from "@/lib/actions/getUserToken";
import { GameMode } from "@/lib/types/GameMode";
import { User } from "@/lib/types/User";
import { UserStats } from "@/lib/types/UserStats";

interface UserResponse {
  data: User | null;
  stats?: UserStats;
  error?: string;
}

export async function getUser(
  id: number,
  mode?: GameMode
): Promise<UserResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/${id}${
      mode != undefined ? `?mode=${mode}` : ""
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

  if (mode != undefined) {
    return { data: response.user, stats: response.stats };
  } else {
    return { data: response };
  }
}
