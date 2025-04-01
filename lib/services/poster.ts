import { getUsetToken } from "@/lib/actions/getUserToken";
import { PossibleErrorResult } from "@/lib/hooks/api/types";
import { kyInstance } from "@/lib/services/fetcher";
import { Options } from "ky";

const poster = async <T>(url: string, options?: Options) => {
  const token = await getUsetToken();

  const result = await kyInstance
    .post<T>(url, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    .then(async (res) => {
      try {
        return await res.json();
      } catch {
        return null;
      }
    });

  if (!result) {
    throw new Error("Unknown error");
  }

  return result as T;
};

export default poster;
