import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostUserUsernameChangeData } from "@/lib/types/api";

export function useUsernameChange() {
  return useSWRMutation(`user/self`, usernameChange);
}

async function usernameChange(url: string, { arg }: { arg: PostUserUsernameChangeData["body"] }) {
  return await poster(`user/username/change`, {
    json: {
      ...arg,
    },
  });
}
