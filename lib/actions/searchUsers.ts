import { getUsetToken } from "@/lib/actions/getUserToken";
import { User } from "../types/User";

interface UserScoresResponse {
  data: {
    result: User[];
    total_count: number;
  } | null;
  error?: string;
}

export async function searchUsers(
  query: string,
  page?: number,
  limit?: number
): Promise<UserScoresResponse> {
  const token = await getUsetToken();

  const response = await fetch(
    `https://api.${
      process.env.NEXT_PUBLIC_SERVER_DOMAIN
    }/user/search${`?query=${query}`}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  if (!response || response.error) {
    return { data: null, error: response?.error || "Unknown error" };
  }

  // TODO: Edit once the API is updated
  return { data: { result: response, total_count: response.length } };
}
