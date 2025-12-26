import Image from "next/image";
import Link from "next/link";

import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import { FriendshipButton } from "@/components/FriendshipButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Tooltip } from "@/components/Tooltip";
import { MaterialSymbolsCircleOutline } from "@/components/ui/icons/circle-outline";
import type { UserResponse } from "@/lib/types/api";

interface UserListItemProps {
  user: UserResponse;
  includeFriendshipButton?: boolean;
}

export function UserListItem({
  user,
  includeFriendshipButton = true,
}: UserListItemProps) {
  return (
    <div className="group relative z-10 flex items-center justify-between rounded-lg bg-transparent px-3 shadow-md">
      <>
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <ImageWithFallback
            src={`${user.banner_url}&default=false`}
            alt="user bg"
            fill={true}
            objectFit="cover"
            className="relative -z-20 -translate-x-2/4"
            fallBackSrc="/images/placeholder.png"
            fallBackClassName="opacity-0 group-hover:opacity-30"
          />
        </div>
        <div className="smooth-transition absolute inset-0 -z-10 rounded-lg bg-gradient-to-l from-card via-card to-card/75 group-hover:to-card/50" />
      </>

      <Link
        href={`/user/${user.user_id}`}
        className="flex flex-grow items-center gap-3 overflow-hidden"
      >
        <div className="flex-none overflow-hidden rounded-full border-2 border-white">
          <Image
            src={user?.avatar_url}
            alt={`${user.username}'s profile`}
            objectFit="cover"
            width={48}
            height={48}
          />
        </div>

        <div className="line-clamp-1">
          <div className="flex items-center gap-2">
            <div className="flex flex-row gap-x-2">
              <Tooltip
                className="flex min-w-0 flex-row space-x-2"
                content={user.username}
                align="start"
              >
                <h3 className="line-clamp-1 font-medium">{user.username}</h3>
              </Tooltip>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex flex-shrink-0 flex-row"
              >
                <UserPrivilegeBadges badges={user.badges} small={true} />
              </div>
            </div>

            <img
              src={`/images/flags/${user.country_code}.png`}
              alt="User Flag"
              className="mr-4 size-8"
            />
          </div>

          <div className="mt-1 flex flex-grow items-center space-x-2 rounded-t-lg bg-muted bg-opacity-70 p-0.5 text-sm">
            <MaterialSymbolsCircleOutline
              className={`text-${statusColor(
                user.user_status,
              )} flex-shrink-0 text-base`}
            />

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="line-clamp-1 flex"
            >
              <UserStatusText user={user} />
            </div>
          </div>
        </div>
      </Link>

      {includeFriendshipButton && (
        <div className="flex items-center gap-2">
          <FriendshipButton
            userId={user.user_id}
            className="size-10"
            includeText={false}
          />
        </div>
      )}
    </div>
  );
}
