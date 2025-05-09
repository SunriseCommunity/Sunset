import { Tooltip } from "@/components/Tooltip";

import {
  Coffee,
  HeartHandshake,
  Music,
  Shield,
  BotIcon,
  Badge as BadgeIcon,
  BanIcon,
  Trophy,
  Calendar,
  UserIcon,
  Gamepad2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { twMerge } from "tailwind-merge";
import React from "react";
import {
  UserBadge,
  UserMetadataResponse,
  UserPlaystyle,
  UserResponse,
} from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";
import { useUserFriendsCount } from "@/lib/hooks/api/user/useUserFriends";

interface UserGeneralInformationProps {
  user: UserResponse;
  metadata?: UserMetadataResponse;
}

export default function UserGeneralInformation({
  user,
  metadata,
}: UserGeneralInformationProps) {
  const userPlaystyle = metadata ? metadata.playstyle.join(", ") : null;

  const friendsQuery = useUserFriendsCount(user.user_id);

  const friendsData = friendsQuery.data;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm my-1 text-muted-foreground/80 mt-3">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>
          Joined{" "}
          <span className="font-bold">
            <Tooltip content={new Date(user.register_date).toLocaleString()}>
              <p className="text-md text-muted-foreground font-bald">
                {timeSince(user.register_date)}
              </p>
            </Tooltip>
          </span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <UserIcon className="h-4 w-4" />
        <span className="font-bold text-gray-300">
          {friendsData?.followers ?? 0}
        </span>{" "}
        Followers
      </div>
      <div className="flex items-center gap-1">
        <UserIcon className="h-4 w-4" />
        <span className="font-bold text-gray-300">
          {friendsData?.following ?? 0}
        </span>{" "}
        Following
      </div>

      {userPlaystyle && userPlaystyle != UserPlaystyle.NONE && (
        <div className="flex items-center gap-1">
          <Gamepad2 className="h-4 w-4" />
          <span>
            Plays with{" "}
            <span className="font-bold text-muted-foreground">
              {userPlaystyle}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
