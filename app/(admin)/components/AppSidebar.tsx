"use client";

import { SidebarUser } from "@/app/(admin)/components/SidebarUser";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";

import { ThemeModeToggle } from "@/components/Header/ThemeModeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useBeatmapSetGetHypedSets } from "@/lib/hooks/api/beatmap/useBeatmapSetHypedSets";
import useSelf from "@/lib/hooks/useSelf";
import { UserBadge } from "@/lib/types/api";
import { Home, ChevronsUp, Music2, Moon, Sun } from "lucide-react";
import Link from "next/link";

const infoTabs = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
];

const actionTabs = [
  {
    title: "Beatmap ranking",
    url: "/admin/beatmaps/search",
    icon: Music2,
    requires: UserBadge.BAT,
  },
  {
    title: "Beatmap requests",
    url: "/admin/beatmaps/requests",
    icon: ChevronsUp,
    requires: UserBadge.BAT,
    badge: () => {
      const requestsQuery = useBeatmapSetGetHypedSets();

      const { data } = requestsQuery;

      return (
        data?.find((item) => item.total_count !== undefined)?.total_count ?? 0
      );
    },
  },
];

export function AppSidebar() {
  const { self } = useSelf();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Information</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoTabs.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionTabs.map((item) => {
                var requirements =
                  item.requires &&
                  !self?.badges.includes(item.requires) &&
                  !self?.badges.includes(UserBadge.ADMIN);

                var badge = item.badge && (
                  <SidebarMenuBadge>{item.badge()}</SidebarMenuBadge>
                );

                return requirements ? undefined : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {badge}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarGroup>
        <ThemeModeToggle>
          <SidebarMenuButton>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            Change theme
          </SidebarMenuButton>
        </ThemeModeToggle>
      </SidebarGroup>

      <SidebarSeparator />
      <SidebarFooter>
        {self ? <SidebarUser self={self} /> : <HeaderLoginDialog />}
      </SidebarFooter>
    </Sidebar>
  );
}
