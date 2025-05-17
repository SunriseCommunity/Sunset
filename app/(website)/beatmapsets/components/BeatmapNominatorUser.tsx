import UserHoverCard from "@/components/UserHoverCard";
import { BeatmapResponse, UserResponse } from "@/lib/types/api";
import Image from "next/image";
import Link from "next/link";

export function BeatmapNominatorUser({ user }: { user: UserResponse }) {
  return (
    <UserHoverCard user={user} asChild>
      <Link
        className="cursor-pointer font-bold hover:text-primary smooth-transition"
        href={`/user/${user.user_id}`}
      >
        <div className="flex gap-1 items-center ">
          <div className="relative w-4 h-4 overflow-hidden rounded">
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={`${user.username}'s avatar`}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="text-primary font-bold">{user.username}</span>
        </div>
      </Link>
    </UserHoverCard>
  );
}
