import type { Metadata } from "next";

import { AppSidebar } from "@/app/(admin)/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Admin Panel | osu!sunrise",
  openGraph: {
    title: "Admin Panel | osu!sunrise",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="px-2">
          <SidebarTrigger />
        </div>

        <div className="mx-auto w-full max-w-7xl p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
