import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { User } from "@/lib/hooks/api/user/types";
import React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { MaterialSymbolsCircleOutline } from "@/components/ui/icons/circle-outline";
import UserStatusText, {
  statusColor,
} from "@/app/user/[id]/components/UserStatusText";
import { FriendshipButton } from "@/components/FriendshipButton";
import Link from "next/link";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import UserBadges from "@/app/user/[id]/components/UserBadges";

export default function UserHoverCard({
  user,
  children,
  align,
  asChild,
}: {
  user: User;
  children: React.ReactNode;
  align?: "center" | "start" | "end";
  asChild?: boolean;
}) {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild={asChild}>{children}</HoverCardTrigger>
      <HoverCardContent
        align={align}
        className="relative w-72 overflow-hidden p-0"
      >
        <div className="relative h-full place-content-between flex-col flex group-hover:cursor-pointer ">
          <ImageWithFallback
            src={`${user?.banner_url}&default=false`}
            alt=""
            fill={true}
            objectFit="cover"
            className="bg-stone-700"
            fallBackSrc="/images/placeholder.png"
          />

          <div className="absolute inset-0 bg-black bg-opacity-80 smooth-transition group-hover:bg-opacity-35" />

          <Link
            href={`/user/${user.user_id}`}
            className="relative flex place-content-between h-24 p-4"
          >
            <div className="relative flex items-start">
              {/* Profile Picture */}
              <div className="rounded-full flex-none overflow-hidden border-2 border-white mr-4">
                <Image
                  src={user?.avatar_url}
                  alt={`${user.username}'s profile`}
                  objectFit="cover"
                  width={48}
                  height={48}
                />
              </div>

              <div className="line-clamp-1">
                <div className="flex items-center line-clamp-1">
                  <h2 className="text-white font-bold mr-2 truncate">
                    {user.username}
                  </h2>
                </div>
                <div className="flex items-center">
                  <img
                    src={`/images/flags/${user.country_code}.png`}
                    alt="User Flag"
                    className="w-8 h-8 mr-4"
                  />
                  <div className="flex flex-wrap gap-2">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex flex-row flex-wrap gap-2"
                    >
                      <UserBadges badges={user.badges} small={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FriendshipButton
              userId={user.user_id}
              className="w-10 h-10"
              includeText={false}
            />
          </Link>

          <div className="relative py-2 px-4 bg-black bg-opacity-80 flex flex-row w-full">
            <div className="flex space-x-2 items-center text-sm w-full">
              <MaterialSymbolsCircleOutline
                className={`text-base text-${statusColor(user.user_status)}`}
              />
              <div className="flex flex-grow line-clamp-1 w-8/12">
                <UserStatusText user={user} />
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
