import { UsersListViewModeType } from "@/app/friends/components/UsersListViewModeOptions";
import UserElement from "@/components/UserElement";
import { UserListItem } from "@/components/UserListElement";
import { UserResponse } from "@/lib/types/api";

interface UsersListProps {
  users: UserResponse[];
  viewMode: UsersListViewModeType;
}

export function UsersList({ users, viewMode }: UsersListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-accent-foreground">
        No users found
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
