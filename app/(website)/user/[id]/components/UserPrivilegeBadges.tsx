import { Tooltip } from "@/components/Tooltip";

import {
  Coffee,
  HeartHandshake,
  Music,
  Shield,
  BotIcon,
  Badge as BadgeIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { twMerge } from "tailwind-merge";
import React from "react";
import { UserBadge } from "@/lib/types/api";

interface UserPrivilegeBadgesProps {
  badges: UserBadge[];
  small?: boolean;
  className?: string;
  withToolTip?: boolean;
}

const badgeMap = {
  [UserBadge.DEVELOPER]: {
    icon: <Coffee className="w-4 h-4 md:w-6 md:h-6" />,
    color:
      "bg-orange-500/30 hover:bg-orange-400/30 text-orange-400 border-orange-600",
  },
  [UserBadge.BAT]: {
    icon: <Music className="w-4 h-4 md:w-6 md:h-6" />,
    color:
      "bg-violet-600/30 hover:bg-violet-500/30 text-violet-400 border-violet-600",
  },
  [UserBadge.BOT]: {
    icon: <BotIcon className="w-4 h-4 md:w-6 md:h-6" />,
    color:
      "bg-neutral-600/30 hover:bg-neutral-500/30 text-neutral-400 border-neutral-600",
  },
  [UserBadge.ADMIN]: {
    icon: <Shield className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-red-600/30 hover:bg-red-500/30 text-red-400 border-red-600",
  },
  [UserBadge.SUPPORTER]: {
    icon: <HeartHandshake className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-pink-600/30 hover:bg-pink-500/30 text-pink-400 border-pink-600",
  },
};

export default function UserPrivilegeBadges({
  badges,
  small,
  className,
  withToolTip = true,
}: UserPrivilegeBadgesProps) {
  return (
    <div className={twMerge("flex flex-wrap gap-1", className)}>
      {badges.map((badge, index) => {
        let { icon, color } = badgeMap[badge] || {
          icon: <BadgeIcon className="w-4 h-4 md:w-6 md:h-6 " />,
          color:
            "bg-slate-600/30 hover:bg-slate-500/30 text-slate-400 border-slate-600",
          description: "",
        };

        if (small)
          icon = React.cloneElement(icon, {
            className: "w-4 h-4",
          });

        return (
          <Tooltip
            content={<p className="capitalize">{badge}</p>}
            key={`user-badge-${index}`}
            disabled={!withToolTip}
          >
            <div className="bg-black/50 rounded-lg">
              <Badge
                className={twMerge(
                  `flex text-white items-center text-xs p-1 rounded-lg ${color} smooth-transition`,
                  !small ? "md:text-base md:gap-2 md:p-1.5 gap-1" : "",
                  withToolTip ? "hover:scale-105" : ""
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
