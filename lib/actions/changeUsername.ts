import { getUsetToken } from "@/lib/actions/getUserToken";

interface ChangeUsernameResponse {
  isSuccessful: boolean;
  error?: string;
}

export async function changeUsername(
  newUsername: string
): Promise<ChangeUsernameResponse> {
  const token = await getUsetToken();

  if (!token) {
    return { isSuccessful: false, error: "Unauthorized" };
  }

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/username/change`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_username: newUsername,
      }),
    }
  );

  if (response.ok) {
    return { isSuccessful: true };
  } else {
    return {
      isSuccessful: false,
      error: (await response.json())?.error || "Unknown error",
    };
  }
}
