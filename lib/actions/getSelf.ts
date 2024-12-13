import { getUsetToken } from "@/lib/actions/getUserToken";
import { User } from "@/lib/types/User";
import { clearAuthCookies } from "@/lib/utils/clearAuthCookies";

export async function getSelf(): Promise<User | null> {
  const token = await getUsetToken();

  if (!token) {
    return null;
  }

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/self`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response || response?.error) {
    clearAuthCookies();
    return null;
  }

  return response;
}
