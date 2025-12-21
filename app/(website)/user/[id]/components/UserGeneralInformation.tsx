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
import { useT } from "@/lib/i18n/utils";

interface UserGeneralInformationProps {
  user: UserResponse;
  metadata?: UserMetadataResponse;
}

export default function UserGeneralInformation({
  user,
  metadata,
}: UserGeneralInformationProps) {
  const t = useT("pages.user.components.generalInformation");
  const tPlaystyle = useT("pages.settings.components.playstyle");
  const userPlaystyle = metadata ? metadata.playstyle.join(", ") : null;

  const friendsQuery = useUserFriendsCount(user.user_id);

  const friendsData = friendsQuery.data;

  const localizedPlaystyle = metadata
    ? metadata.playstyle.map((p) => tPlaystyle(`options.${p}`)).join(", ")
    : null;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm my-1 text-muted-foreground/70 mt-3">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>
          <Tooltip content={new Date(user.register_date).toLocaleString()}>
            {t.rich("joined", {
              b: (chunks) => (
                <span className="font-bold text-muted-foreground">
                  {chunks}
                </span>
              ),
              time: timeSince(user.register_date),
            })}
          </Tooltip>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <UserIcon className="h-4 w-4" />
        {t.rich("followers", {
          b: (chunks) => (
            <span className="font-bold text-muted-foreground">{chunks}</span>
          ),
          count: friendsData?.followers ?? 0,
        })}
      </div>
      <div className="flex items-center gap-1">
        <UserIcon className="h-4 w-4" />

        {t.rich("following", {
          b: (chunks) => (
            <span className="font-bold text-muted-foreground">{chunks}</span>
          ),
          count: friendsData?.following ?? 0,
        })}
      </div>

      {userPlaystyle &&
        userPlaystyle != UserPlaystyle.NONE &&
        localizedPlaystyle && (
          <div className="flex items-center gap-1">
            <Gamepad2 className="h-4 w-4" />
            <span>
              {t.rich("playsWith", {
                playstyle: localizedPlaystyle,
                b: (chunks) => (
                  <span className="font-bold text-muted-foreground">
                    {chunks}
                  </span>
                ),
              })}
            </span>
          </div>
        )}
    </div>
  );
}
