import { UserFileUpload } from "@/lib/hooks/api/user/types";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import useSWRMutation from "swr/mutation";

export function useUserUpload() {
  const { data } = useUserSelf();
  return useSWRMutation(data ? `user/${data.user_id}` : null, userUpload);
}

const userUpload = async (
  url: string,
  { arg }: { arg: { file: File; type: UserFileUpload } }
) => {
  const formData = new FormData();
  formData.append("file", arg.file);

  return await poster(`user/upload/${arg.type}`, {
    body: formData,
  });
};
