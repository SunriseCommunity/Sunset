import Image from "next/image";
import Link from "next/link";

import UserHoverCard from "@/components/UserHoverCard";
import type { UserResponse } from "@/lib/types/api";

export function BeatmapNominatorUser({ user }: { user: UserResponse }) {
  return (
    <UserHoverCard user={user} asChild>
      <Link
        className="smooth-transition cursor-pointer font-bold hover:text-primary"
        href={`/user/${user.user_id}`}
      >
        <span className="mx-1 font-bold text-primary">
          <span>
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={`${user.username}'s avatar`}
              width={16}
              height={16}
              className="mr-1 inline-block rounded object-cover align-middle"
            />
          </span>

          {user.username}
        </span>
      </Link>
    </UserHoverCard>
  );
}
