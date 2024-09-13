import Cookies from "js-cookie";

export async function authorize(
  username: string,
  password: string
): Promise<boolean> {
  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        us: username,
        pa: password,
      }),
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response) {
    return false;
  }

  const { token, refresh_token, expires_in } = response;

  if (!token || !refresh_token || !expires_in) {
    return false;
  }

  Cookies.set("session_token", token, {
    expires: new Date(Date.now() + expires_in * 1000),
  });

  Cookies.set("refresh_token", refresh_token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return true;
}
