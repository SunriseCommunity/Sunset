import PrettyCounter from "@/components/General/PrettyCounter";
import { Gamepad2Icon, Signal, UsersIcon } from "lucide-react";

interface Props {
  type: "total_users" | "users_online" | "server_status";
  data: string | number;
}

const statuses = {
  total_users: {
    name: "Total Users",
    icon: <UsersIcon />,
  },
  users_online: {
    name: "Users Online",
    icon: <Gamepad2Icon />,
  },
  server_status: {
    name: "Server Status",
    icon: <Signal />,
  },
};

export default function ServerStatus({ type, data }: Props) {
  const isDataNumber = !isNaN(Number(data));

  return (
    <div className="px-6 py-3 border rounded-full backdrop-blur-sm">
      <h2 className="text-sm font-medium text-current">
        {statuses[type].name}
      </h2>
      <div className="flex items-center space-x-2">
        {statuses[type].icon}
        <div
          className={`text-lg font-semibold ${
            type === "server_status"
              ? data === "Online"
                ? "text-green-500"
                : "text-red-500"
              : "text-current"
          }`}
        >
          {isDataNumber ? <PrettyCounter value={Number(data)} /> : data}
        </div>
      </div>
    </div>
  );
}
