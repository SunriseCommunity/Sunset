import { getUsetToken } from "@/lib/actions/getUserToken";
import { PossibleErrorResult } from "@/lib/hooks/api/types";
import ky, { Options } from "ky";

export const kyInstance = ky.create({
  prefixUrl: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`,
});

const fetcher = async <T>(url: string, options?: Options) => {
  const token = await getUsetToken();

  const result = (await kyInstance
    .get(url, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-cache", // TODO: Simplify cache on backend so we can rely on it for more "static" data
    })
    .then(async (res) => {
      try {
        return await res.json();
      } catch {
        return null;
      }
    })) as PossibleErrorResult<T>;

  if (result?.error) {
    throw new Error(result.error);
  }

  return result as T;
};

export default fetcher;
