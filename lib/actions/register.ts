import Cookies from "js-cookie";

interface AuthResponse {
  isSuccessful: boolean;
  error?: string;
}

export async function register(
  username: string,
  password: string,
  email: string
): Promise<AuthResponse> {
  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response) {
    return {
      isSuccessful: false,
      error: "Unknown error",
    };
  }

  const { token, refresh_token, expires_in, error } = response;

  if (error) {
    return {
      isSuccessful: false,
      error,
    };
  }

  Cookies.set("session_token", token, {
    expires: new Date(Date.now() + expires_in),
  });

  Cookies.set("refresh_token", refresh_token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    isSuccessful: true,
  };
}
