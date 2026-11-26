import { ClientSidebar } from "@/components/client/client-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}