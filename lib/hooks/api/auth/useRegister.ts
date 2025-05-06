import poster from "@/lib/services/poster";
import {
  PostAuthRegisterData,
  PostAuthRegisterResponse,
} from "@/lib/types/api";
import useSWRMutation from "swr/mutation";

export function useRegister() {
  return useSWRMutation(`user/self`, register);
}

const register = async (
  url: string,
  { arg }: { arg: PostAuthRegisterData["body"] }
) => {
  return await poster<PostAuthRegisterResponse>(`auth/register`, {
    json: {
      ...arg,
    },
  });
};
