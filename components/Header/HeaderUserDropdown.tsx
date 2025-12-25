"use client";

import {
  Cog,
  Home,
  LogOutIcon,
  MonitorCog,
  UserCircleIcon,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import { HeaderLogoutAlert } from "@/components/Header/HeaderLogoutAlert";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";
import { isUserCanUseAdminPanel } from "@/lib/utils/userPrivileges.util";

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
  const t = useT("components.headerUserDropdown");
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
          <DropdownMenuLabel className="relative my-1 flex items-center gap-x-3">
            <>
              <div className="absolute inset-0 z-10 overflow-hidden rounded-md ">
                <ImageWithFallback
                  src={`${self.banner_url}&default=false`}
                  alt="user bg"
                  fill={true}
                  objectFit="cover"
                  className="relative opacity-60 blur-sm"
                  fallBackSrc="/images/placeholder.png"
                />
              </div>
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-popover to-popover/30" />
            </>

            <Avatar className="z-20 scale-105">
              <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                <Image
                  src={self.avatar_url}
                  width={64}
                  height={64}
                  alt="Avatar"
                />
              </Suspense>
            </Avatar>
            <div className="z-20 flex flex-col">
              <div className="truncate text-sm font-medium">
                {self.username}
              </div>

              <UserPrivilegeBadges
                badges={self.badges}
                small
                className="w-full origin-left scale-75"
              />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/user/${self.user_id}`} className="cursor-pointer">
                <UserCircleIcon />
                {t("myProfile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/friends">
                <Users2 />
                {t("friends")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/settings">
                <Cog />
                {t("settings")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {isUserCanUseAdminPanel(self) && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="cursor-pointer">
                {pathname.includes("/admin") ? (
                  <Link href="/">
                    <Home />
                    {t("returnToMainSite")}
                  </Link>
                ) : (
                  <Link href="/admin">
                    <MonitorCog />
                    {t("adminPanel")}
                  </Link>
                )}
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={e => e.preventDefault()}
            asChild
            className="cursor-pointer"
          >
            <HeaderLogoutAlert className="w-full text-start">
              <LogOutIcon />
              {t("logOut")}
            </HeaderLogoutAlert>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
