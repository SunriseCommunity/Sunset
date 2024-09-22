import { getUsetToken } from "@/lib/actions/getUserToken";

interface UserFriendshipStatusResponse {
  data: {
    is_following: boolean;
    is_followed: boolean;
  } | null;
  error?: string;
}

export async function getUserFriendshipStatus(
  id: number
): Promise<UserFriendshipStatusResponse> {
  const token = await getUsetToken();

  if (!token) {
    return { data: null, error: "Unauthorized" };
  }

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/${id}/friend/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response || response.error) {
    return { data: null, error: response?.error || "Unknown error" };
  }

  return { data: response };
}
