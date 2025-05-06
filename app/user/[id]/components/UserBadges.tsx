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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { twMerge } from "tailwind-merge";
import React from "react";
import { UserBadge } from "@/lib/types/api";

interface UserBadgesProps {
  badges: UserBadge[];
  small?: boolean;
}

// TODO: Should be deprecated in favor of backend-provided badge descriptions, names, and icons
const badgeMap = {
  [UserBadge.DEVELOPER]: {
    icon: <Coffee className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-orange-500 hover:bg-orange-400",
    description: "Humble developer.",
  },
  [UserBadge.BAT]: {
    icon: <Music className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-violet-600 hover:bg-violet-500",
    description: "They manage beatmap submissions.",
  },
  [UserBadge.BOT]: {
    icon: <BotIcon className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-neutral-600 hover:bg-neutral-500",
    description: "Beep boop. I'm a bot.",
  },
  [UserBadge.ADMIN]: {
    icon: <Shield className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-red-600 hover:bg-red-500",
    description: "Server admin. They keep the peace.",
  },
  [UserBadge.SUPPORTER]: {
    icon: <HeartHandshake className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-pink-600 hover:bg-pink-500",
    description: "Supported the project. Forever grateful.",
  },
};

export default function UserBadges({ badges, small }: UserBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => {
        let { icon, color, description } = badgeMap[badge] || {
          icon: <BadgeIcon className="w-4 h-4 md:w-6 md:h-6 " />,
          color: "bg-slate-600 hover:bg-slate-500",
          description: "",
        };

        if (small)
          icon = React.cloneElement(icon, {
            className: "w-4 h-4",
          });

        return (
          <Tooltip
            content={
              <p className="capitalize">{small ? badge : description}</p>
            }
            key={`user-badge-${index}`}
          >
            <Badge
              className={twMerge(
                `flex text-white items-center text-xs p-1 rounded-lg ${color} smooth-transition hover:scale-105 `,
                !small ? "md:text-base md:gap-2 md:p-2 gap-1" : ""
              )}
            >
              {icon}
              <span>{!small && badge}</span>
            </Badge>
          </Tooltip>
        );
      })}
    </div>
  );
}
