import { getUsetToken } from "@/lib/actions/getUserToken";

interface EditResponse {
  isSuccessful: boolean;
  error?: string;
}

export async function editDescription(text: string): Promise<EditResponse> {
  const token = await getUsetToken();

  if (!token) {
    return { isSuccessful: false, error: "Unauthorized" };
  }

  const res = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/edit/description`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: text }),
    }
  );

  if (res.ok) {
    return { isSuccessful: true };
  } else {
    return {
      isSuccessful: false,
      error: (await res.json())?.error || "Unknown error",
    };
  }
}
