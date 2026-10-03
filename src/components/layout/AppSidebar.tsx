import { routes } from "@/config/sidebar-items"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar"

const AppSidebar = () => {
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
                className="text-color-secondary py-4.5"
              >
                <Icon /> <span>{route.name}</span>
              </SidebarMenuButton>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 py-5 text-caption">
        <div className="text-color-secondary">Theme · Dark</div>
        <div className="text-color-muted">Open-source project</div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
