import poster from "@/lib/services/poster";
import { PostUserUsernameChangeData } from "@/lib/types/api";
import useSWRMutation from "swr/mutation";

export function useUsernameChange() {
  return useSWRMutation(`user/self`, usernameChange);
}

const usernameChange = async (
  url: string,
  { arg }: { arg: PostUserUsernameChangeData["body"] }
) => {
  return await poster(`user/username/change`, {
    json: {
      ...arg,
    },
  });
};
