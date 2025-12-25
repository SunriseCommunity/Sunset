"use client";

import { MoreVerticalIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { UserResponse } from "@/lib/types/api";

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
              <Avatar className="size-8 rounded-lg">
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
                <div className="truncate text-sm font-medium">
                  {self.username}
                </div>

                <UserPrivilegeBadges
                  badges={self.badges}
                  small
                  className="w-full origin-left scale-75"
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
