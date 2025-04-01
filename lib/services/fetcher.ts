import { getUsetToken } from "@/lib/actions/getUserToken";
import { PossibleErrorResult } from "@/lib/hooks/api/types";
import ky, { HTTPError, Options } from "ky";

const errorInterceptor = async (error: HTTPError) => {
  const { response } = error;
  const contentType = response?.headers?.get("content-type");

  if (contentType != null && contentType?.indexOf("application/json") !== -1) {
    const data = (await response.json()) as PossibleErrorResult<null>;
    error.message = data.error ?? "Unknown error";
  } else {
    error.message = await response.text();
  }
  return error;
};

export const kyInstance = ky.create({
  prefixUrl: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`,
  hooks: {
    beforeError: [errorInterceptor],
  },
});

const fetcher = async <T>(url: string, options?: Options) => {
  const token = await getUsetToken();

  const result = await kyInstance
    .get(url, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-cache", // TODO: Simplify cache on backend so we can rely on it for more "static" data
    })
    .then(async (res) => {
      const contentType = res?.headers?.get("content-type");

      if (
        contentType != null &&
        contentType?.indexOf("application/json") !== -1
      ) {
        try {
          return await res.json();
        } catch {
          return null;
        }
      } else {
        return await res.text();
      }
    });

  if (!result) {
    throw new Error("Unknown error");
  }

  return result as T;
};

export default fetcher;
