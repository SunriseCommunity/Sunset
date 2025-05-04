import { twMerge } from "tailwind-merge";

import Image from "next/image";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import { UserResponse } from "@/lib/types/api";

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
        className
      )}
    >
      <Link href={`/user/${user.user_id}`}>
        <div className="relative h-full place-content-between flex-col flex group-hover:cursor-pointer smooth-transition">
          <ImageWithFallback
            src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${user.user_id}?default=false`}
            alt=""
            fill={true}
            objectFit="cover"
            className="bg-stone-700 rounded-t-lg"
            fallBackSrc="/images/placeholder.png"
          />

          <div className="absolute inset-0 bg-black bg-opacity-70 group-hover:bg-opacity-50 smooth-transition" />

          <div className="relative flex items-center">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
              <Image
                src={user.avatar_url}
                alt=""
                width={48}
                height={48}
                className="w-full h-12 object-cover"
              />
            </div>

            {/* Username and Flag */}
            <div className="flex items-center">
              <img
                src={`/images/flags/${user.country_code}.png`}
                alt="Russian Flag"
                className="w-5 h-5 mr-2"
              />
              <h2 className="text-white text-lg font-bold mr-2">
                {user.username}
              </h2>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
