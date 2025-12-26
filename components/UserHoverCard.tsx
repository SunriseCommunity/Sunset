import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import { FriendshipButton } from "@/components/FriendshipButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MaterialSymbolsCircleOutline } from "@/components/ui/icons/circle-outline";
import type { UserResponse } from "@/lib/types/api";

export default function UserHoverCard({
  user,
  children,
  align,
  asChild,
  includeFriendshipButton = true,
}: {
  user: UserResponse;
  children: React.ReactNode;
  align?: "center" | "start" | "end";
  asChild?: boolean;
  includeFriendshipButton?: boolean;
}) {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild={asChild}>{children}</HoverCardTrigger>
      <HoverCardContent
        align={align}
        className="relative w-72 overflow-hidden p-0"
      >
        <div className="relative flex h-full flex-col place-content-between group-hover:cursor-pointer ">
          <ImageWithFallback
            src={`${user?.banner_url}&default=false`}
            alt=""
            fill={true}
            objectFit="cover"
            className="bg-stone-700"
            fallBackSrc="/images/placeholder.png"
          />

          <div className="smooth-transition absolute inset-0 bg-black bg-opacity-80 group-hover:bg-opacity-35" />

          <Link
            href={`/user/${user.user_id}`}
            className="relative flex h-24 place-content-between p-4"
          >
            <div className="relative flex items-start">
              {/* Profile Picture */}
              <div className="mr-4 flex-none overflow-hidden rounded-full border-2 border-white">
                <Image
                  src={user?.avatar_url}
                  alt={`${user.username}'s profile`}
                  objectFit="cover"
                  width={48}
                  height={48}
                />
              </div>

              <div className="line-clamp-1">
                <div className="line-clamp-1 flex items-center">
                  <h2 className="mr-2 truncate font-bold text-white">
                    {user.username}
                  </h2>
                </div>
                <div className="flex items-center">
                  <img
                    src={`/images/flags/${user.country_code}.png`}
                    alt="User Flag"
                    className="mr-4 size-8"
                  />
                  <div className="flex flex-wrap gap-2">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex flex-row flex-wrap gap-2"
                    >
                      <UserPrivilegeBadges badges={user.badges} small={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {includeFriendshipButton && (
              <FriendshipButton
                userId={user.user_id}
                className="size-10"
                includeText={false}
              />
            )}
          </Link>

          <div className="relative flex w-full flex-row bg-black bg-opacity-80 px-4 py-2">
            <div className="flex w-full items-center space-x-2 text-sm">
              <MaterialSymbolsCircleOutline
                className={`text-${statusColor(user.user_status)} text-base`}
              />
              <div className="line-clamp-1 flex w-8/12 flex-grow">
                <UserStatusText user={user} />
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
