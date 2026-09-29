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
    <Sidebar>
      <SidebarHeader className="flex-row items-center">
        <div className="h-6 w-6 rounded-full bg-devlens-violet-500" />
        <div>DevLense</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuButton>Request</SidebarMenuButton>
          <SidebarMenuButton>History</SidebarMenuButton>
          <SidebarMenuButton>Collections</SidebarMenuButton>
          <SidebarMenuButton>Environments</SidebarMenuButton>
          <SidebarMenuButton>Settings</SidebarMenuButton>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div>Theme - Dark</div>
        <div>Open-source project</div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
