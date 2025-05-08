import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import poster from "@/lib/services/poster";
import {
  EditUserMetadataRequest,
  GetUserByIdMetadataResponse,
} from "@/lib/types/api";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export function useUserMetadata(userId: number | null) {
  return useSWR<GetUserByIdMetadataResponse>(
    userId ? `user/${userId}/metadata` : null
  );
}

export function useEditUserMetadata() {
  const { data } = useUserSelf();
  return useSWRMutation(
    data ? `user/${data.user_id}/metadata` : null,
    editMetadata
  );
}

const editMetadata = async (
  url: string,
  { arg }: { arg: EditUserMetadataRequest }
) => {
  return await poster(`user/edit/metadata`, {
    json: {
      ...arg,
    },
  });
};
