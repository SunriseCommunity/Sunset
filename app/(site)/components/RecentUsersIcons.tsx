import { User } from "@/lib/hooks/api/user/types";
import Image from "next/image";
import Link from "next/link";

export default function RecentUsersIcons({ users }: { users: User[] }) {
  return (
    <div className="flex -space-x-2 mr-2">
      {users.map((u, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full border-2 hover:scale-110 overflow-hidden relative z-${
            users.length - i
          }0`}
        >
          <Link href={`/user/${u.user_id}`}>
            <Image
              src={u.avatar_url}
              alt="user avatar"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
