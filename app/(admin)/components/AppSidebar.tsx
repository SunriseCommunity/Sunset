"use client";

import { SidebarUser } from "@/app/(admin)/components/SidebarUser";
import { Brand } from "@/components/Brand";
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
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBeatmapSetGetHypedSets } from "@/lib/hooks/api/beatmap/useBeatmapSetHypedSets";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import useSelf from "@/lib/hooks/useSelf";
import { Home, ChevronsUp, Music2, Settings, MonitorCog } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const infoTabs = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
];

const actionTabs = [
  {
    title: "Beatmap ranking",
    url: "#",
    icon: Music2,
  },
  {
    title: "Beatmap requests",
    url: "#",
    icon: ChevronsUp,
    badge: () => {
      const requestsQuery = useBeatmapSetGetHypedSets();

      const { data } = requestsQuery;

      return data?.total_count;
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
              {actionTabs.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge()}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{self && <SidebarUser self={self} />}</SidebarFooter>
    </Sidebar>
  );
}
