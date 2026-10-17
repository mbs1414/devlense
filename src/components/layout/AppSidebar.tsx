import { routes } from "@/config/sidebar-items"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { useTheme } from "next-themes"

const AppSidebar = () => {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const { theme } = useTheme()

  return (
    <Sidebar className="bg-sidebar border-border-subtle">
      <SidebarHeader className="flex-row items-center px-4 py-5 gap-2.5">
        <div className="size-6 rounded-full bg-action-primary" />
        <div className="font-semibold text-color-primary">DevLens</div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu className="flex flex-col gap-1">
          {routes.map((route) => {
            const Icon = route.icon

            return (
              <SidebarMenuButton
                key={route.name}
                isActive={pathname === route.to}
                className="text-color-secondary py-4.5 data-[active=true]:bg-sidebar-accent data-[active=true]:text-color-primary data-[active=true]:font-semibold"
                asChild
              >
                <Link to={route.to} className="flex items-center gap-2">
                  <Icon /> <span>{route.name}</span>
                </Link>
              </SidebarMenuButton>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 py-5 text-caption">
        <div className="text-color-secondary">Theme · {theme}</div>
        <div className="text-color-muted">Open-source project</div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
