"use client";

import { MoreVerticalIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserResponse } from "@/lib/types/api";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import { Suspense } from "react";
import Image from "next/image";

export function SidebarUser({ self }: { self: UserResponse }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {self ? (
          <HeaderUserDropdown
            self={self}
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            align="end"
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                  <Image
                    src={self.avatar_url}
                    width={64}
                    height={64}
                    alt="Avatar"
                  />
                </Suspense>
              </Avatar>
              <div className="flex flex-col">
                <div className="truncate font-medium text-sm">
                  {self.username}
                </div>

                <UserPrivilegeBadges
                  badges={self.badges}
                  small
                  className="scale-75 w-full origin-left"
                  withToolTip={false}
                />
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </HeaderUserDropdown>
        ) : (
          <HeaderLoginDialog />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
