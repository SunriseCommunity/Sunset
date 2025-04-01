import { Tooltip } from "@/components/Tooltip";
import { UserBadge } from "@/lib/hooks/api/user/types";
import {
  Coffee,
  HeartHandshake,
  Music,
  Shield,
  BotIcon,
  Badge,
  BanIcon,
  Trophy,
} from "lucide-react";

interface UserBadgesProps {
  badges: UserBadge[];
}

// TODO: Should be deprecated in favor of backend-provided badge descriptions, names, and icons
const BadgeDescription: { [key in UserBadge]: any } = {
  admin: "Server admin. They keep the peace. 🛡️",
  developer: "Humble developer. They make the magic happen. 🪄",
  supporter: "Supported the project. Forever grateful.",
  bat: "They manage beatmap submissions.",
  champion: "Current number one player on the server. 🏆",
  bot: "Beep boop. I'm a bot.",
  restricted: "This user is restricted.", // Deprecated
};

export default function UserBadges({ badges }: UserBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => {
        let badgeIcon;
        let badgeColor;

        switch (badge) {
          case "developer":
            badgeIcon = <Coffee size={24} />;
            badgeColor = "bg-orange-500 hover:bg-orange-400";
            break;
          case "bat":
            badgeIcon = <Music size={24} />;
            badgeColor = "bg-violet-600 hover:bg-violet-500";
            break;
          case "bot":
            badgeIcon = <BotIcon size={24} />;
            badgeColor = "bg-neutral-600 hover:bg-neutral-500";
            break;
          case "admin":
            badgeIcon = <Shield size={24} />;
            badgeColor = "bg-red-600 hover:bg-red-500";
            break;
          case "supporter":
            badgeIcon = <HeartHandshake size={24} />;
            badgeColor = "bg-pink-600 hover:bg-pink-500";
            break;
          case "champion":
            badgeIcon = <Trophy size={24} />;
            badgeColor = "bg-amber-500 hover:bg-amber-400";
            break;
          case "restricted":
            badgeIcon = <BanIcon size={24} />;
            badgeColor = "bg-red-600 hover:bg-red-500";
            break;
          default:
            badgeIcon = <Badge size={24} />;
            badgeColor = "bg-slate-600 hover:bg-slate-500";
            break;
        }

        return (
          <Tooltip content={BadgeDescription[badge]}>
            <div
              key={`user-badge-${index}`}
              className={`flex items-center gap-2 p-2 rounded-lg ${badgeColor} smooth-transition hover:scale-105 `}
            >
              {badgeIcon}
              <span>{badge}</span>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
