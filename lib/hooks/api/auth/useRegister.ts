import poster from "@/lib/services/poster";
import useSWRMutation from "swr/mutation";

export function useRegister() {
  return useSWRMutation(`user/self`, register);
}

const register = async (
  url: string,
  { arg }: { arg: { username: string; password: string; email: string } }
) => {
  return await poster<{
    token: string;
    refresh_token: string;
    expires_in: number;
  }>(`auth/register`, {
    json: {
      ...arg,
    },
  });
};
