"use client";

import { UsersListViewModeType } from "@/app/(website)/friends/components/UsersListViewModeOptions";
import UserElement from "@/components/UserElement";
import { UserListItem } from "@/components/UserListElement";
import { UserResponse } from "@/lib/types/api";
import { useT } from "@/lib/i18n/utils";

interface UsersListProps {
  users: UserResponse[];
  viewMode: UsersListViewModeType;
}

export function UsersList({ users, viewMode }: UsersListProps) {
  const t = useT("pages.friends");

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-accent-foreground">
        {t("emptyState")}
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-2"
      }
    >
      {users.map((user) =>
        viewMode === "grid" ? (
          <UserElement key={user.user_id} user={user} includeFriendshipButton />
        ) : (
          <UserListItem key={user.user_id} user={user} />
        )
      )}
    </div>
  );
}
