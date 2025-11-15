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
import { HypedBeatmapSetsResponse, UserBadge } from "@/lib/types/api";
import { Home, ChevronsUp, Music2, Moon, Sun, Users } from "lucide-react";
import Link from "next/link";
import { SWRInfiniteResponse } from "swr/infinite";

const infoTabs = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users/search",
    icon: Users,
    requires: UserBadge.ADMIN,
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
    beatmapsRequestBadge: (
      requestsQuery: SWRInfiniteResponse<HypedBeatmapSetsResponse, any>
    ) => {
      const { data } = requestsQuery;

      return (
        data?.find((item) => item.total_count !== undefined)?.total_count ?? 0
      );
    },
  },
];

export function AppSidebar() {
  const { self } = useSelf();
  const requestsQuery = useBeatmapSetGetHypedSets();

  const infoTabsWithAccess = infoTabs.filter((item) => {
    if (!self) return false;

    var requirements = item.requires && !self.badges.includes(item.requires);
    return !requirements;
  });

  const actionTabsWithAccess = actionTabs.filter((item) => {
    if (!self) return false;

    var requirements = item.requires && !self.badges.includes(item.requires);
    return !requirements;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {self ? (infoTabsWithAccess.length > 0 ? "Information" : "") : null}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoTabsWithAccess.map((item) => (
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
          <SidebarGroupLabel>
            {self ? (actionTabsWithAccess.length > 0 ? "Actions" : "") : null}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionTabsWithAccess.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.beatmapsRequestBadge && (
                    <SidebarMenuBadge>
                      {item.beatmapsRequestBadge(requestsQuery)}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
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
