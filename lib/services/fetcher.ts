import type { HTTPError, Options } from "ky";
import ky from "ky";

import { getUserToken } from "@/lib/actions/getUserToken";
import type { ProblemDetailsResponseType } from "@/lib/types/api";

async function errorInterceptor(error: HTTPError) {
  const { response } = error;
  const contentType = response?.headers?.get("content-type");

  if (
    contentType != null
    && contentType?.indexOf("application/problem+json") !== -1
  ) {
    const data = (await response.json()) as ProblemDetailsResponseType;
    error.message = data.detail ?? data.title ?? "Unknown error";
  }
  else {
    error.message = await response.text();
  }
  return error;
}

export const kyInstance = ky.create({
  prefixUrl: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`,
  hooks: {
    beforeError: [errorInterceptor],
  },
});

async function fetcher<T>(url: string, options?: Options) {
  const token = await getUserToken();

  if (!token && url.includes("user/self")) {
    throw new Error("Unauthorized");
  }

  const result = await kyInstance
    .get(url, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    .then(async (res) => {
      const contentType = res?.headers?.get("content-type");

      if (!(contentType != null
        && contentType?.indexOf("application/json") !== -1)) {
        return res;
      }

      try {
        return await res.json();
      }
      catch {
        return null;
      }
    });

  if (!result) {
    throw new Error("Unknown error");
  }

  return result as T;
}

export default fetcher;
