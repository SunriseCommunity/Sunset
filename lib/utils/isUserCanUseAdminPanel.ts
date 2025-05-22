import { UserBadge, UserResponse } from "@/lib/types/api";

export function isUserCanUseAdminPanel(user: UserResponse) {
  return user.badges.some((b) => [UserBadge.BAT, UserBadge.ADMIN].includes(b));
}
