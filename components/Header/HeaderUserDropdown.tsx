"use client";

import { Suspense } from "react";
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
import { HeaderLogoutAlert } from "@/components/Header/HeaderLogoutAlert";
import Link from "next/link";
import { UserBadge, UserResponse } from "@/lib/types/api";
import {
  Cog,
  Home,
  LogOutIcon,
  MonitorCog,
  UserCircleIcon,
  Users2,
} from "lucide-react";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  self: UserResponse | null;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export default function HeaderUserDropdown({
  self,
  children,
  side,
  sideOffset,
  align,
}: Props) {
  const pathname = usePathname();

  return (
    self && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side={side}
          sideOffset={sideOffset}
          align={align}
        >
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
            <div className="flex flex-col z-20">
              <div className="truncate font-medium text-sm">
                {self.username}
              </div>

              <UserPrivilegeBadges
                badges={self.badges}
                small
                className="scale-75 w-full origin-left"
              />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/user/${self.user_id}`}>
                <UserCircleIcon />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/friends`}>
                <Users2 />
                Friends
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/settings`}>
                <Cog />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {self.badges.map((b) =>
            [UserBadge.BAT, UserBadge.ADMIN].includes(b)
          ) && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                {pathname.includes("/admin") ? (
                  <Link href={`/`}>
                    <Home />
                    Return to main site
                  </Link>
                ) : (
                  <Link href={`/admin`}>
                    <MonitorCog />
                    Admin panel
                  </Link>
                )}
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <HeaderLogoutAlert className="w-full text-start">
              <LogOutIcon />
              Log out
            </HeaderLogoutAlert>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
