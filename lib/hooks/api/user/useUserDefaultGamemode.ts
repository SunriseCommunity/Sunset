"use client";

import poster from "@/lib/services/poster";
import { PostUserEditDefaultGamemodeData, UserResponse } from "@/lib/types/api";
import useSWRMutation from "swr/mutation";

export function useUpdateUserDefaultGamemode() {
  return useSWRMutation(`user/self`, updateUserefaultGamemode);
}

const updateUserefaultGamemode = async (
  url: string,
  {
    arg,
  }: {
    arg: PostUserEditDefaultGamemodeData["body"] & {
      user: UserResponse;
    };
  }
) => {
  return poster(`user/edit/default-gamemode`, {
    json: {
      ...arg,
    },
  });
};
