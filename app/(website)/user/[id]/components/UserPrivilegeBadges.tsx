import {
  Badge as BadgeIcon,
  BotIcon,
  Coffee,
  HeartHandshake,
  Music,
  Shield,
} from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/utils";
import { UserBadge } from "@/lib/types/api";

interface UserPrivilegeBadgesProps {
  badges: UserBadge[];
  small?: boolean;
  className?: string;
  withToolTip?: boolean;
}

const badgeMap = {
  [UserBadge.DEVELOPER]: {
    icon: <Coffee className="size-4 md:size-6" />,
    color:
      "bg-orange-500/30 hover:bg-orange-400/30 text-orange-400 border-orange-600",
  },
  [UserBadge.BAT]: {
    icon: <Music className="size-4 md:size-6" />,
    color:
      "bg-violet-600/30 hover:bg-violet-500/30 text-violet-400 border-violet-600",
  },
  [UserBadge.BOT]: {
    icon: <BotIcon className="size-4 md:size-6" />,
    color:
      "bg-neutral-600/30 hover:bg-neutral-500/30 text-neutral-400 border-neutral-600",
  },
  [UserBadge.ADMIN]: {
    icon: <Shield className="size-4 md:size-6" />,
    color: "bg-red-600/30 hover:bg-red-500/30 text-red-400 border-red-600",
  },
  [UserBadge.SUPPORTER]: {
    icon: <HeartHandshake className="size-4 md:size-6" />,
    color: "bg-pink-600/30 hover:bg-pink-500/30 text-pink-400 border-pink-600",
  },
};

export default function UserPrivilegeBadges({
  badges,
  small,
  className,
  withToolTip = true,
}: UserPrivilegeBadgesProps) {
  const t = useT("pages.user.components.privilegeBadges");

  const badgeNames = useMemo(
    () => ({
      [UserBadge.DEVELOPER]: t("badges.Developer"),
      [UserBadge.ADMIN]: t("badges.Admin"),
      [UserBadge.BAT]: t("badges.Bat"),
      [UserBadge.BOT]: t("badges.Bot"),
      [UserBadge.SUPPORTER]: t("badges.Supporter"),
    }),
    [t],
  );

  return (
    <div className={twMerge("flex flex-wrap gap-1", className)}>
      {badges.map((badge) => {
        // eslint-disable-next-line prefer-const -- the icon variable is reassigned
        let { icon, color } = badgeMap[badge] || {
          icon: <BadgeIcon className="size-4 md:size-6 " />,
          color:
            "bg-slate-600/30 hover:bg-slate-500/30 text-slate-400 border-slate-600",
          description: "",
        };

        if (small) {
          // eslint-disable-next-line @eslint-react/no-clone-element -- fine with us
          icon = React.cloneElement(icon, {
            className: "w-4 h-4",
          });
        }

        const badgeName = badgeNames[badge] || badge;

        return (
          <Tooltip
            content={<p className="capitalize">{badgeName}</p>}
            key={`user-badge-${badge}`}
            disabled={!withToolTip}
          >
            <div className="rounded-lg bg-black/50">
              <Badge
                className={twMerge(
                  `flex text-white items-center text-xs p-1 rounded-lg ${color} smooth-transition`,
                  !small ? "md:text-base md:gap-2 md:p-1.5 gap-1" : "",
                  withToolTip ? "hover:scale-105" : "",
                )}
              >
                {icon}
              </Badge>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
