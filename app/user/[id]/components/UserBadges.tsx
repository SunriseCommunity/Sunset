import { Tooltip } from "@/components/Tooltip";
import { UserBadge } from "@/lib/hooks/api/user/types";
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

interface UserBadgesProps {
  badges: UserBadge[];
  small?: boolean;
}

// TODO: Should be deprecated in favor of backend-provided badge descriptions, names, and icons
const badgeMap = {
  developer: {
    icon: <Coffee className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-orange-500 hover:bg-orange-400",
    description: "Humble developer.",
  },
  bat: {
    icon: <Music className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-violet-600 hover:bg-violet-500",
    description: "They manage beatmap submissions.",
  },
  bot: {
    icon: <BotIcon className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-neutral-600 hover:bg-neutral-500",
    description: "Beep boop. I'm a bot.",
  },
  admin: {
    icon: <Shield className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-red-600 hover:bg-red-500",
    description: "Server admin. They keep the peace.",
  },
  supporter: {
    icon: <HeartHandshake className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-pink-600 hover:bg-pink-500",
    description: "Supported the project. Forever grateful.",
  },
  champion: {
    icon: <Trophy className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-amber-500 hover:bg-amber-400",
    description: "Current number one player on the server.",
  },
  restricted: {
    icon: <BanIcon className="w-4 h-4 md:w-6 md:h-6" />,
    color: "bg-red-600 hover:bg-red-500",
    description: "This user is restricted.", // Deprecated
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
