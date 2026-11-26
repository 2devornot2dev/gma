"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Inquiries", href: "/admin/inquiries", icon: Inbox },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Content", href: "/admin/content", icon: FileText },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

function NavButton({ item, isActive = false }: { item: NavItem; isActive?: boolean }) {
  return (
    <SidebarMenuButton
      render={<Link href={item.href} />}
      isActive={isActive}
      tooltip={item.title}
      className="text-white"
    >
      <item.icon className="text-knicks" />
      <span>{item.title}</span>
    </SidebarMenuButton>
  )
}

function ActiveNavButton({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)

  return <NavButton item={item} isActive={isActive} />
}

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />}>
              <div className="bg-navy-700 text-knicks flex size-8 shrink-0 items-center justify-center rounded-md">
                <Shield className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  GMA Admin
                </span>
                <span className="truncate text-xs text-white/70">
                  Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-white/60">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Suspense fallback={<NavButton item={item} />}>
                      <ActiveNavButton item={item} />
                    </Suspense>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to site"
              className="text-white"
            >
              <ArrowUpRight className="text-knicks" />
              <span>View Site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}