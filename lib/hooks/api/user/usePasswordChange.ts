import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostUserPasswordChangeData } from "@/lib/types/api";

export function usePasswordChange() {
  return useSWRMutation(`user/self`, passwordChange);
}

async function passwordChange(url: string, { arg }: { arg: PostUserPasswordChangeData["body"] }) {
  return await poster(`user/password/change`, {
    json: {
      ...arg,
    },
  });
}
