import { getUsetToken } from "@/lib/actions/getUserToken";

interface UploadResponse {
  isSuccessful: boolean;
  error?: string;
}

export async function uploadUserFile(
  file: File,
  type: "avatar" | "banner"
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/user/upload/${type}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getUsetToken()}`,
      },
      body: formData,
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
