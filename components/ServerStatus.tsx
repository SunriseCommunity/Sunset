import Image from "next/image";
import PrettyCounter from "@/components/PrettyCounter";

interface Props {
  type: "total_users" | "users_online" | "server_status";
  data: string | number;
}

const statuses = {
  total_users: {
    name: "Total Users",
    svg: "account-group",
  },
  users_online: {
    name: "Users Online",
    svg: "account-badge",
  },
  server_status: {
    name: "Server Status",
    svg: "access-point-network",
  },
};

export default async function ServerStatus({ type, data }: Props) {
  const isDataNumber = !isNaN(Number(data));

  return (
    <div className="px-6 py-3 border-neutral-300 border-[1px] rounded-full backdrop-blur-sm">
      <h2 className="text-sm font-thin text-neutral-300">
        {statuses[type].name}
      </h2>
      <div className="flex items-center space-x-2">
        <Image
          src={`/icons/${statuses[type].svg}.svg`}
          width={24}
          height={24}
          alt={statuses[type].name}
          className="dark:invert"
        />
        <div
          className={`text-lg font-bold ${
            type === "server_status"
              ? data === "Online"
                ? "text-green-500"
                : "text-red-500"
              : "text-neutral-100"
          }`}
        >
          {isDataNumber ? <PrettyCounter value={Number(data)} /> : data}
        </div>
      </div>
    </div>
  );
}
