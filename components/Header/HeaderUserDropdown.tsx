"use client";

import { Suspense } from "react";
import { User } from "@/lib/hooks/api/user/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useRouter } from "next/navigation";
import { HeaderLogoutAlert } from "@/components/Header/HeaderLogoutAlert";

interface Props {
  self: User | null;
}

export default function HeaderUserDropdown({ self }: Props) {
  const router = useRouter();

  return (
    self && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer smooth-transition hover:scale-110">
            <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
              <Image
                src={self.avatar_url}
                width={64}
                height={64}
                alt="Avatar"
              />
            </Suspense>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="relative flex items-center gap-x-3 my-1">
            <>
              <div className="absolute inset-0 z-10 overflow-hidden rounded-md ">
                <ImageWithFallback
                  src={self.banner_url + "&default=false"}
                  alt="user bg"
                  fill={true}
                  objectFit="cover"
                  className="relative blur-sm opacity-60"
                  fallBackSrc="/images/placeholder.png"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-popover to-popover/30 z-10" />
            </>

            <Avatar className="scale-105 z-20">
              <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                <Image
                  src={self.avatar_url}
                  width={64}
                  height={64}
                  alt="Avatar"
                />
              </Suspense>
            </Avatar>
            <p className="z-20"> {self.username}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => router.push(`/user/${self.user_id}`)}
            >
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/friends`)}>
              Friends
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/settings`)}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <HeaderLogoutAlert className="w-full text-start">
              Log out
            </HeaderLogoutAlert>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
