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
  );

  if (!response) {
    return null;
  }

  const data = await response.json();

  Cookies.set("session_token", data.token, {
    expires: new Date(Date.now() + data.expires_in * 1000),
  });

  return data.token;
}
