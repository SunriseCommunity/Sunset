import PrettyCounter from "@/components/General/PrettyCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Users, AlertTriangle, Trophy, Wifi } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  type:
    | "total_users"
    | "users_online"
    | "total_scores"
    | "users_restricted"
    | "server_status";
  data?: string | number;
  children?: React.ReactNode;
}

const statuses = {
  total_users: {
    nameKey: "total_users",
    icon: <Users className="h-4 w-4 text-blue-500" />,
  },
  users_online: {
    nameKey: "users_online",
    icon: <Activity className="h-4 w-4 text-orange-500" />,
  },
  users_restricted: {
    nameKey: "users_restricted",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  total_scores: {
    nameKey: "total_scores",
    icon: <Trophy className="h-4 w-4 text-yellow-500" />,
  },
  server_status: {
    nameKey: "server_status",
    icon: <Wifi className="h-4 w-4 " />,
  },
};

export default function ServerStatus({ type, data, children }: Props) {
  const isDataNumber = !isNaN(Number(data));

  const t = useTranslations("pages.main_page.statuses");

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-full bg-card border shadow`}
    >
      <div
        className={`flex-shrink-0 ${
          type === "server_status"
            ? data === t("online")
              ? "text-green-500"
              : data === t("under_maintenance")
              ? "text-orange-500"
              : "text-red-500"
            : "text-current"
        }`}
      >
        {statuses[type].icon}
      </div>

      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          {t(statuses[type].nameKey)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-current">
            {data !== undefined ? (
              isDataNumber ? (
                <PrettyCounter value={Number(data)} />
              ) : (
                data
              )
            ) : (
              <Skeleton className="w-20 h-6 rounded-lg my-1" />
            )}
          </span>

          {children}
        </div>
      </div>
    </div>
  );
}
