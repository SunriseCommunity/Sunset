import { getUserToken } from "@/lib/actions/getUserToken";
import { PossibleErrorResult } from "@/lib/hooks/api/types";
import { ProblemDetailsResponseType } from "@/lib/types/api";
import ky, { HTTPError, Options } from "ky";

const errorInterceptor = async (error: HTTPError) => {
  const { response } = error;
  const contentType = response?.headers?.get("content-type");

  if (
    contentType != null &&
    contentType?.indexOf("application/problem+json") !== -1
  ) {
    const data = (await response.json()) as ProblemDetailsResponseType;
    error.message = data.detail ?? data.title ?? "Unknown error";
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
        return res;
      }
    });

  if (!result) {
    throw new Error("Unknown error");
  }

  return result as T;
};

export default fetcher;
