import { getUsetToken } from "@/lib/actions/getUserToken";

interface UserResponse {
  error?: string;
}

export async function downloadReplay(id: number): Promise<UserResponse> {
  const token = await getUsetToken();

  if (!token) {
    return { error: "You need to be logged in to download replays" };
  }

  const response = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/score/${id}/replay`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).catch(() => null);

  if (!response || !response.ok) {

    const { error } =await  response?.json()

    return { error:  error ?? "Unknown error" };
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  a.download = `${id}.osr`;
  a.click();
  window.URL.revokeObjectURL(url);

  return {};
}
