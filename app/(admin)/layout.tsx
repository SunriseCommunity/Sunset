import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(admin)/components/AppSidebar";

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

        <div className="p-4 w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
}
