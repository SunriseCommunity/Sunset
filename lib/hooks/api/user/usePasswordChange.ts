import poster from "@/lib/services/poster";
import { PostUserPasswordChangeData } from "@/lib/types/api";
import useSWRMutation from "swr/mutation";

export function usePasswordChange() {
  return useSWRMutation(`user/self`, passwordChange);
}

const passwordChange = async (
  url: string,
  { arg }: { arg: PostUserPasswordChangeData["body"] }
) => {
  return await poster(`user/password/change`, {
    json: {
      ...arg,
    },
  });
};
