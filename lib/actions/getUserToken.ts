import { clearAuthCookies } from "@/lib/utils/clearAuthCookies";
import Cookies from "js-cookie";

export async function getUsetToken(): Promise<string | null> {
  const token = Cookies.get("session_token");

  if (token) {
    return token;
  }

  const refreshToken = Cookies.get("refresh_token");

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response) {
    return null;
  }

  if (response.error) {
    clearAuthCookies();
    return null;
  }

  Cookies.set("session_token", response.token, {
    expires: new Date(Date.now() + response.expires_in * 1000),
  });

  return response.token;
}
