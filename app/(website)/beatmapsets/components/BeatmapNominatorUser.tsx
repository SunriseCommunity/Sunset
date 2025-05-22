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
        <span className="text-primary font-bold mx-1">
          <span>
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={`${user.username}'s avatar`}
              width={16}
              height={16}
              className="object-cover rounded align-middle inline-block mr-1"
            />
          </span>

          {user.username}
        </span>
      </Link>
    </UserHoverCard>
  );
}
