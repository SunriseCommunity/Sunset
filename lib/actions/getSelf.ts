import { getUsetToken } from "@/lib/actions/getUserToken";
import { User } from "@/lib/types/User";

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
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response) {
    return null;
  }

  return response;
}
