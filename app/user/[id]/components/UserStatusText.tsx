import PrettyDate from "@/components/General/PrettyDate";
import { Tooltip } from "@/components/Tooltip";
import { User } from "@/lib/hooks/api/user/types";
import { twMerge } from "tailwind-merge";

export const statusColor = (status: string) =>
  status.trim() === "Offline"
    ? "stone-500"
    : status.trim() === "Idle" || status.trim() === "Afk"
    ? "orange-600"
    : "green-600";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
}

export default function UserStatusText({ user, ...props }: Props) {
  const userStatus = (truncate: boolean, withTime: boolean) => (
    <div className={twMerge(truncate ? "truncate" : "", "flex flex-nowrap")}>
      {user.user_status}
      {user.user_status === "Offline" && (
        <div className="flex flex-nowrap">
          , last seen on&nbsp;
          <PrettyDate time={user.last_online_time} withTime={false} />
        </div>
      )}
    </div>
  );

  return (
    <Tooltip
      className="flex flex-row flex-grow min-w-0"
      content={userStatus(false, false)}
      align="start"
    >
      <div
        {...props}
        className={twMerge(
          "flex flex-grow justify-start min-w-0 mr-2",
          `text-${statusColor(user.user_status)}`,
          props.className
        )}
      >
        {userStatus(true, false)}
      </div>
    </Tooltip>
  );
}
