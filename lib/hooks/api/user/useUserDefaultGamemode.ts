"use client";

import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostUserEditDefaultGamemodeData, UserResponse } from "@/lib/types/api";

export function useUpdateUserDefaultGamemode() {
  return useSWRMutation(`user/self`, updateUserefaultGamemode);
}

async function updateUserefaultGamemode(url: string, {
  arg,
}: {
  arg: PostUserEditDefaultGamemodeData["body"] & {
    user: UserResponse;
  };
}) {
  return poster(`user/edit/default-gamemode`, {
    json: {
      ...arg,
    },
  });
}
