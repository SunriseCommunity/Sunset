import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import useSWRMutation from "swr/mutation";

export function useEditDescription() {
  const { data } = useUserSelf();
  return useSWRMutation(data ? `user/${data.user_id}` : null, editDescription);
}

const editDescription = async (
  url: string,
  { arg }: { arg: { description: string } }
) => {
  return await poster(`user/edit/description`, {
    json: {
      ...arg,
    },
  });
};
