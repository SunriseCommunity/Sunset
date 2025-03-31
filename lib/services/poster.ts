import { getUsetToken } from "@/lib/actions/getUserToken";
import { kyInstance } from "@/lib/services/fetcher";
import { Options } from "ky";

const poster = async (url: string, options?: Options) => {
  const token = await getUsetToken();

  const result = await kyInstance.post(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return result;
};

export default poster;
