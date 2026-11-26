"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  Building2,
  FileCheck2,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingBag,
  Store,
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
    label: "Ordering",
    items: [
      { title: "Overview", href: "/client", icon: LayoutDashboard },
      { title: "Catalog", href: "/client/catalog", icon: ShoppingBag },
      { title: "Orders", href: "/client/orders", icon: Package },
    ],
  },
  {
    label: "Billing & Docs",
    items: [
      { title: "Invoices", href: "/client/invoices", icon: Receipt },
      { title: "Certs & Docs", href: "/client/documents", icon: FileCheck2 },
      { title: "Account", href: "/client/account", icon: Building2 },
    ],
  },
]

function NavButton({
  item,
  isActive = false,
}: {
  item: NavItem
  isActive?: boolean
}) {
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
    item.href === "/client"
      ? pathname === "/client"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)

  return <NavButton item={item} isActive={isActive} />
}

export function ClientSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/client" />}>
              <div className="bg-navy-700 text-knicks flex size-8 shrink-0 items-center justify-center rounded-md">
                <Store className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  GMA Portal
                </span>
                <span className="truncate text-xs text-white/70">
                  Distributor
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