import Image from "next/image";
import { Heart, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/lib/types/api";
import { FriendshipButton } from "@/components/FriendshipButton";
import UserStatusText, {
  statusColor,
} from "@/app/user/[id]/components/UserStatusText";
import { MaterialSymbolsCircleOutline } from "@/components/ui/icons/circle-outline";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Tooltip } from "@/components/Tooltip";
import UserPrivilegeBadges from "@/app/user/[id]/components/UserPrivilegeBadges";
import Link from "next/link";

interface UserListItemProps {
  user: UserResponse;
}

export function UserListItem({ user }: UserListItemProps) {
  return (
    <div className="relative bg-transparent z-10 rounded-lg px-3 flex group items-center justify-between shadow-md">
      <>
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <ImageWithFallback
            src={user.banner_url + "&default=false"}
            alt="user bg"
            fill={true}
            objectFit="cover"
            className="relative -z-20 -translate-x-2/4"
            fallBackSrc="/images/placeholder.png"
            fallBackClassName="opacity-0 group-hover:opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-card to-card/75 via-card group-hover:to-card/50 -z-10 rounded-lg smooth-transition" />
      </>

      <Link
        href={`/user/${user.user_id}`}
        className="flex flex-grow items-center overflow-hidden gap-3"
      >
        <div className="rounded-full flex-none overflow-hidden border-2 border-white">
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
                className="flex flex-row min-w-0 space-x-2"
                content={user.username}
                align="start"
              >
                <h3 className="font-medium line-clamp-1">{user.username}</h3>
              </Tooltip>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex flex-row flex-shrink-0"
              >
                <UserPrivilegeBadges badges={user.badges} small={true} />
              </div>
            </div>

            <img
              src={`/images/flags/${user.country_code}.png`}
              alt="User Flag"
              className="w-8 h-8 mr-4"
            />
          </div>

          <div className="flex space-x-2 flex-grow items-center text-sm bg-black bg-opacity-70 p-0.5 mt-1 rounded-t-lg">
            <MaterialSymbolsCircleOutline
              className={`text-base text-${statusColor(
                user.user_status
              )} flex-shrink-0`}
            />

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex line-clamp-1"
            >
              <UserStatusText user={user} />
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <FriendshipButton
          userId={user.user_id}
          className="w-10 h-10"
          includeText={false}
        />
      </div>
    </div>
  );
}
