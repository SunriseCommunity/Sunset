import { Activity, AlertTriangle, Trophy, Users, Wifi } from "lucide-react";

import PrettyCounter from "@/components/General/PrettyCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n/utils";

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
    nameKey: "totalUsers",
    icon: <Users className="size-4 text-blue-500" />,
  },
  users_online: {
    nameKey: "usersOnline",
    icon: <Activity className="size-4 text-orange-500" />,
  },
  users_restricted: {
    nameKey: "usersRestricted",
    icon: <AlertTriangle className="size-4 text-red-500" />,
  },
  total_scores: {
    nameKey: "totalScores",
    icon: <Trophy className="size-4 text-yellow-500" />,
  },
  server_status: {
    nameKey: "serverStatus",
    icon: <Wifi className="size-4 " />,
  },
};

export default function ServerStatus({ type, data, children }: Props) {
  const isDataNumber = !Number.isNaN(Number(data));

  const t = useT("pages.mainPage.statuses");

  return (
    <div
      className="flex items-center gap-3 rounded-full border bg-card px-4 py-2 shadow"
    >
      <div
        className={`flex-shrink-0 ${
          type === "server_status"
            ? data === t("online")
              ? "text-green-500"
              : data === t("underMaintenance")
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
              isDataNumber
                ? (
                    <PrettyCounter value={Number(data)} />
                  )
                : (
                    data
                  )
            ) : (
              <Skeleton className="my-1 h-6 w-20 rounded-lg" />
            )}
          </span>

          {children}
        </div>
      </div>
    </div>
  );
}
