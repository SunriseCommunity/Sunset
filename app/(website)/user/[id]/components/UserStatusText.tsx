import { dateToPrettyString } from "@/components/General/PrettyDate";
import { Tooltip } from "@/components/Tooltip";
import { UserResponse } from "@/lib/types/api";
import { twMerge } from "tailwind-merge";
import { useT } from "@/lib/i18n/utils";

export const statusColor = (status: string) =>
  status.trim() === "Offline"
    ? "stone-500"
    : status.trim() === "Idle" || status.trim() === "Afk"
    ? "orange-600"
    : "green-600";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: UserResponse;
  asChild?: boolean;
  disabled?: boolean;
}

export default function UserStatusText({
  user,
  asChild,
  disabled,
  ...props
}: Props) {
  const t = useT("pages.user.components.statusText");
  const userStatus = (isTooltip: boolean) => (
    <p className={isTooltip ? "break-all" : "truncate"}>
      {user.user_status === "Offline" ? (
        <>
          {user.user_status}
          {t("lastSeenOn", { date: dateToPrettyString(user.last_online_time) })}
        </>
      ) : (
        user.user_status
      )}
    </p>
  );

  return (
    <Tooltip
      className="flex flex-row flex-grow min-w-0"
      content={userStatus(true)}
      align="start"
      asChild={asChild}
      disabled={disabled}
    >
      <div
        {...props}
        className={twMerge(
          "flex flex-grow justify-start min-w-0 mr-2",
          `text-${statusColor(user.user_status)}`,
          props.className
        )}
      >
        {userStatus(false)}
      </div>
    </Tooltip>
  );
}
