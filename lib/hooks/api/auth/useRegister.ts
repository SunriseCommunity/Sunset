import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type {
  PostAuthRegisterData,
  PostAuthRegisterResponse,
} from "@/lib/types/api";

export function useRegister() {
  return useSWRMutation(`user/self`, register);
}

async function register(url: string, { arg }: { arg: PostAuthRegisterData["body"] }) {
  return await poster<PostAuthRegisterResponse>(`auth/register`, {
    json: {
      ...arg,
    },
  });
}
