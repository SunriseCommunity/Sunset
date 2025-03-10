import { User } from "@/lib/types/User";
import { twMerge } from "tailwind-merge";

import Image from "next/image";
import ImageWithFallback from "./ImageWithFallback";

interface UserProfileBannerProps {
  user: User;
  className?: string;
}

export default function UserElement({
  user,
  className,
}: UserProfileBannerProps) {
  return (
    <div
      className={twMerge(
        "relative w-full overflow-hidden rounded-lg group h-36",
        className
      )}
      onClick={() => window.open("/user/" + user.user_id)}
    >
      <div className="relative h-full place-content-between flex-col flex group-hover:cursor-pointer smooth-transition">
        <ImageWithFallback
          src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${
            user.user_id
          }?default=false&${Date.now()}`}
          alt=""
          fill={true}
          objectFit="cover"
          className="bg-stone-700 rounded-t-lg"
          fallBackSrc="/images/placeholder.png"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-35" />

        <div className="relative flex items-start h-24 p-4">
          {/* Profile Picture */}
          <div className="rounded-full flex-none overflow-hidden border-2 border-white mr-4">
            <Image
              src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${
                user.user_id
              }?${Date.now()}`}
              alt={`${user.username}'s profile`}
              objectFit="cover"
              width={48}
              height={48}
            />
          </div>

          {/* Username, Flag, and Status */}
          <div>
            <div className="flex items-center mb-1">
              <h2 className="text-white md:text-lg lg:text-xl font-bold mr-2 overflow-hidden flex-wrap">
                {user.username}
              </h2>
            </div>
            <img
              src={`/images/flags/${user.country_code}.png`}
              alt="Russian Flag"
              className="w-6 h-6 mr-2"
            />
          </div>
        </div>

        <div className="relative py-2 px-4 text-white bg-black bg-opacity-50 rounded-b-lg ">
          <div className="text-gray-300 text-base mb-1">{user.user_status}</div>
        </div>
      </div>
    </div>
  );
}
