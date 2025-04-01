import { kyInstance } from "@/lib/services/fetcher";
import { clearAuthCookies } from "@/lib/utils/clearAuthCookies";
import Cookies from "js-cookie";

export async function getUserToken(): Promise<string | null> {
  const token = Cookies.get("session_token");

  if (token) {
    return token;
  }

  const refreshTokenString = Cookies.get("refresh_token");

  if (!refreshTokenString) {
    return null;
  }

  try {
    const data = await refreshToken({
      arg: { refresh_token: refreshTokenString },
    });

    if (!data) {
      throw new Error("Failed to refresh token");
    }

    Cookies.set("session_token", data.token, {
      expires: new Date(Date.now() + data.expires_in * 1000),
    });

    return data.token;
  } catch (error) {
    clearAuthCookies();
    return null;
  }
}

const refreshToken = async ({ arg }: { arg: { refresh_token: string } }) => {
  return await kyInstance
    .post<{
      token: string;
      expires_in: number;
    }>(`auth/refresh`, {
      json: {
        ...arg,
      },
    })
    .then((res) => res.json())
    .catch(() => null);
};
