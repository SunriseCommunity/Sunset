import useSWRMutation from "swr/mutation";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import type { EditDescriptionRequest } from "@/lib/types/api";

export function useEditDescription() {
  const { data } = useUserSelf();
  return useSWRMutation(data ? `user/${data.user_id}` : null, editDescription);
}

async function editDescription(url: string, { arg }: { arg: EditDescriptionRequest }) {
  return await poster(`user/edit/description`, {
    json: {
      ...arg,
    },
  });
}
