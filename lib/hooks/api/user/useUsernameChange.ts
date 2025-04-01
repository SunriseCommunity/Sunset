import poster from "@/lib/services/poster";
import useSWRMutation from "swr/mutation";

export function useUsernameChange() {
  return useSWRMutation(`user/self`, usernameChange);
}

const usernameChange = async (
  url: string,
  { arg }: { arg: { new_username: string } }
) => {
  return await poster(`user/username/change`, {
    json: {
      ...arg,
    },
  });
};
