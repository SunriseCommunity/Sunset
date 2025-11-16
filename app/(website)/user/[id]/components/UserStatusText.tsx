import { dateToPrettyString } from "@/components/General/PrettyDate";
import { Tooltip } from "@/components/Tooltip";
import { UserResponse } from "@/lib/types/api";
import { twMerge } from "tailwind-merge";

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
  const userStatus = (isTooltip: boolean) => (
    <p className={isTooltip ? "break-all" : "truncate"}>
      {user.user_status}
      {user.user_status === "Offline" && (
        <span className="">
          , last seen on&nbsp;
          {dateToPrettyString(user.last_online_time)}
        </span>
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
