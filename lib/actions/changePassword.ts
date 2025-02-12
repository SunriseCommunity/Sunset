import { getUsetToken } from "@/lib/actions/getUserToken";

interface ChangePasswordResponse {
  isSuccessful: boolean;
  error?: string;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  const token = await getUsetToken();

  if (!token) {
    return { isSuccessful: false, error: "Unauthorized" };
  }

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/password/change`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
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
