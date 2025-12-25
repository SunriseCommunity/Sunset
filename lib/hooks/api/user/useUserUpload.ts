import useSWRMutation from "swr/mutation";

import type { UserFileUpload } from "@/lib/hooks/api/user/types";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";

export function useUserUpload() {
  const { data } = useUserSelf();
  return useSWRMutation(data ? `user/${data.user_id}` : null, userUpload);
}

async function userUpload(url: string, { arg }: { arg: { file: File; type: UserFileUpload } }) {
  const formData = new FormData();
  formData.append("file", arg.file);

  return await poster(`user/upload/${arg.type}`, {
    body: formData,
  });
}
