import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(admin)/components/AppSidebar";
import { Metadata } from "next";

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

        <div className="py-4 px-4 w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
