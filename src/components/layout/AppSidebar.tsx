import { Link, useLocation } from "@tanstack/react-router"
import { CodeXml } from "lucide-react"

import { routes } from "@/constants/sidebar-items"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "../ui/sidebar"
// import { useTheme } from "next-themes"

const AppSidebar = () => {
  const { isMobile } = useSidebar()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  // const { theme } = useTheme()

  if (isMobile) return null

  return (
    <Sidebar className="bg-sidebar border-border-subtle">
      <SidebarHeader className="flex-row items-center px-4 py-5 gap-2.5 md:justify-center md:px-0">
        <Link
          to="/"
          aria-label="DevLens home"
          className="flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <CodeXml className="size-5 shrink-0 text-action-primary" aria-hidden="true" />
          <span className="font-semibold text-color-primary md:sr-only">DevLens</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 md:px-3">
        <SidebarMenu className="flex flex-col gap-3">
          {routes.map((route) => {
            const Icon = route.icon

            return (
              <SidebarMenuButton
                key={route.name}
                isActive={pathname === route.to}
                tooltip={{ children: route.name, hidden: isMobile }}
                className="h-auto py-2 text-color-secondary [&>svg]:size-5 data-[active=true]:bg-sidebar-accent data-[active=true]:text-color-primary data-[active=true]:font-semibold md:h-12 md:justify-center"
                asChild
              >
                <Link
                  to={route.to}
                  aria-label={route.name}
                  aria-current={pathname === route.to ? "page" : undefined}
                  className="flex flex-col items-center gap-1"
                >
                  <Icon /> <span className="md:sr-only">{route.name}</span>
                </Link>
              </SidebarMenuButton>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* <SidebarFooter className="px-4 py-5 text-caption">
        <div className="text-color-secondary">Theme · {theme}</div>
        <div className="text-color-muted">Open-source project</div>
      </SidebarFooter> */}
    </Sidebar>
  )
}

export default AppSidebar
