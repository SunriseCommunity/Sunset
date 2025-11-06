import poster from "@/lib/services/poster";
import {
  EditUserMetadataRequest,
  UsernameChangeRequest,
  CountryChangeRequest,
  ChangePasswordRequest,
  EditDescriptionRequest,
  UserSensitiveResponse,
  GetUserByIdFriendsResponse,
  GetUserByIdFollowersResponse,
  EditUserRestrictionRequest,
  EditUserPrivilegeRequest,
  ResetPasswordRequest,
} from "@/lib/types/api";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import useSWR from "swr";

export function useAdminEditUserMetadata(userId: number) {
  return useSWRMutation(
    `user/${userId}/metadata`,
    async (url: string, { arg }: { arg: EditUserMetadataRequest }) => {
      const result = await poster(`user/${userId}/edit/metadata`, {
        json: arg,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      mutate(`user/${userId}/metadata`);
      return result;
    }
  );
}

export function useAdminUsernameChange(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: UsernameChangeRequest }) => {
      const result = await poster(`user/${userId}/username/change`, {
        json: arg,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}

export function useAdminCountryChange(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: CountryChangeRequest }) => {
      const result = await poster(`user/${userId}/country/change`, {
        json: arg,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}

export function useAdminPasswordChange(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: ResetPasswordRequest }) => {
      return await poster(`user/${userId}/password/change`, {
        json: arg,
      });
    }
  );
}

export function useAdminUploadAvatar(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: File }) => {
      const formData = new FormData();
      formData.append("file", arg);

      const result = await poster(`user/${userId}/upload/avatar`, {
        body: formData,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}

export function useAdminUploadBanner(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: File }) => {
      const formData = new FormData();
      formData.append("file", arg);

      const result = await poster(`user/${userId}/upload/banner`, {
        body: formData,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}

export function useAdminEditDescription(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: EditDescriptionRequest }) => {
      const result = await poster(`user/${userId}/edit/description`, {
        json: arg,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}

export function useAdminUserFriends(
  userId: number,
  limit?: number,
  page?: number
) {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();
  const endpoint = `user/${userId}/friends${
    queryString ? `?${queryString}` : ""
  }`;

  return useSWR<GetUserByIdFriendsResponse>(endpoint);
}

export function useAdminUserFollowers(
  userId: number,
  limit?: number,
  page?: number
) {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();
  const endpoint = `user/${userId}/followers${
    queryString ? `?${queryString}` : ""
  }`;

  return useSWR<GetUserByIdFollowersResponse>(endpoint);
}

export function useAdminEditRestriction(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: EditUserRestrictionRequest }) => {
      const result = await poster(`user/${userId}/edit/restriction`, {
        json: arg,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}

export function useAdminUserSensitive(userId: number) {
  return useSWR<UserSensitiveResponse>(`user/${userId}/sensitive`);
}

export function useAdminEditPrivilege(userId: number) {
  return useSWRMutation(
    `user/${userId}`,
    async (url: string, { arg }: { arg: EditUserPrivilegeRequest }) => {
      const result = await poster(`user/${userId}/edit/privilege`, {
        json: arg,
      });

      mutate(`user/${userId}`);
      mutate(`user/${userId}/sensitive`);
      return result;
    }
  );
}
