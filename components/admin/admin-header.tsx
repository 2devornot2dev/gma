"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const routeTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/inquiries": "Inquiries",
  "/admin/users": "Users",
  "/admin/content": "Content",
  "/admin/settings": "Settings",
}

export function AdminHeader() {
  const pathname = usePathname()
  const title =
    routeTitles[pathname] ??
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Admin"

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-sm font-medium">{title}</h1>
    </header>
  )
}