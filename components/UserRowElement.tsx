import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import type { UserResponse } from "@/lib/types/api";

import ImageWithFallback from "./ImageWithFallback";

interface UserProfileBannerProps {
  user: UserResponse;
  className?: string;
}

export default function UserRowElement({
  user,
  className,
}: UserProfileBannerProps) {
  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden rounded-lg group h-12",
        className,
      )}
    >
      <Link href={`/user/${user.user_id}`}>
        <div className="smooth-transition relative flex h-full flex-col place-content-between group-hover:cursor-pointer">
          <ImageWithFallback
            src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${user.user_id}?default=false`}
            alt=""
            fill={true}
            objectFit="cover"
            className="rounded-t-lg bg-stone-700"
            fallBackSrc="/images/placeholder.png"
          />

          <div className="smooth-transition absolute inset-0 bg-black bg-opacity-70 group-hover:bg-opacity-50" />

          <div className="relative flex items-center">
            {/* Profile Picture */}
            <div className="mr-4 size-12 overflow-hidden rounded-lg">
              <Image
                src={user.avatar_url}
                alt=""
                width={48}
                height={48}
                className="h-12 w-full object-cover"
              />
            </div>

            {/* Username and Flag */}
            <div className="flex items-center">
              <img
                src={`/images/flags/${user.country_code}.png`}
                alt="Russian Flag"
                className="mr-2 size-5"
              />
              <h2 className="mr-2 text-lg font-bold text-white">
                {user.username}
              </h2>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
