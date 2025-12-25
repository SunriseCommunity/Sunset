import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostAuthTokenData, PostAuthTokenResponse } from "@/lib/types/api";

export function useAuthorize() {
  return useSWRMutation(`user/self`, authorize);
}

async function authorize(url: string, { arg }: { arg: PostAuthTokenData["body"] }) {
  return await poster<PostAuthTokenResponse>(`auth/token`, {
    json: {
      ...arg,
    },
  });
}
