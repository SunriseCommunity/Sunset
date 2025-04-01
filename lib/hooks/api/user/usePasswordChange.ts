import poster from "@/lib/services/poster";
import useSWRMutation from "swr/mutation";

export function usePasswordChange() {
  return useSWRMutation(`user/self`, passwordChange);
}

const passwordChange = async (
  url: string,
  { arg }: { arg: { current_password: string; new_password: string } }
) => {
  return await poster(`user/password/change`, {
    json: {
      ...arg,
    },
  });
};
