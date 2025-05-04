import poster from "@/lib/services/poster";
import { PostAuthTokenData, PostAuthTokenResponse } from "@/lib/types/api";
import useSWRMutation from "swr/mutation";

export function useAuthorize() {
  return useSWRMutation(`user/self`, authorize);
}

const authorize = async (
  url: string,
  { arg }: { arg: PostAuthTokenData['body'] }
) => {
  return await poster<PostAuthTokenResponse>(`auth/token`, {
    json: {
      ...arg,
    },
  });
};
