import { getUsetToken } from "@/lib/actions/getUserToken";

interface UploadResponse {
  isSuccessful: boolean;
  error?: string;
}

export async function editFriendshipStatus(
  id: number,
  status: "add" | "remove"
): Promise<UploadResponse> {
  const token = await getUsetToken();

  if (!token) {
    return { isSuccessful: false, error: "Unauthorized" };
  }

  const res = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/${id}/friend/status?action=${status}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
