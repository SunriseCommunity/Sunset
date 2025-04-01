import poster from "@/lib/services/poster";
import useSWRMutation from "swr/mutation";

export function useAuthorize() {
  return useSWRMutation(`user/self`, authorize);
}

const authorize = async (
  url: string,
  { arg }: { arg: { username: string; password: string } }
) => {
  return await poster<{
    token: string;
    refresh_token: string;
    expires_in: number;
  }>(`auth/token`, {
    json: {
      ...arg,
    },
  });
};
