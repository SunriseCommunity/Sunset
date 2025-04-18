import { twMerge } from "tailwind-merge";

import Image from "next/image";
import ImageWithFallback from "./ImageWithFallback";
import { User } from "@/lib/hooks/api/user/types";
import { FriendshipButton } from "@/components/FriendshipButton";
import { useRouter } from "next/navigation";
import UserStatusText from "@/app/user/[id]/components/UserStatusText";
import Link from "next/link";

interface UserProfileBannerProps {
  user: User;
  includeFriendshipButton?: boolean;
  className?: string;
}

export default function UserElement({
  user,
  includeFriendshipButton = false,
  className,
}: UserProfileBannerProps) {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden rounded-lg group h-36",
        className
      )}
    >
      <div className="relative h-full place-content-between flex-col flex group-hover:cursor-pointer ">
        <ImageWithFallback
          src={`${user?.banner_url}&default=false`}
          alt=""
          fill={true}
          objectFit="cover"
          className="bg-stone-700 rounded-t-lg"
          fallBackSrc="/images/placeholder.png"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 smooth-transition group-hover:bg-opacity-35" />

        <Link
          href={`/user/${user.user_id}`}
          className="relative flex place-content-between h-24 p-4"
        >
          <div className="relative flex items-start">
            {/* Profile Picture */}
            <div className="rounded-full flex-none overflow-hidden border-2 border-white mr-4">
              <Image
                src={user?.avatar_url}
                alt={`${user.username}'s profile`}
                objectFit="cover"
                width={48}
                height={48}
              />
            </div>

            {/* Username, Flag, and Status */}
            <div className="line-clamp-1">
              <div className="flex items-center mb-1 line-clamp-1">
                <h2 className="text-white md:text-lg lg:text-xl font-bold mr-2 truncate">
                  {user.username}
                </h2>
              </div>
              <img
                src={`/images/flags/${user.country_code}.png`}
                alt="User Flag"
                className="w-6 h-6 mr-2"
              />
            </div>
          </div>

          {includeFriendshipButton && (
            <FriendshipButton
              userId={user.user_id}
              className="w-10 h-10"
              includeText={false}
            />
          )}
        </Link>

        <div className="relative py-2 px-4 text-white bg-black bg-opacity-50 rounded-b-lg flex flex-row ">
          <UserStatusText user={user} />
        </div>
      </div>
    </div>
  );
}
