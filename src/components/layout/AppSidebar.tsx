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
    <Sidebar className="bg-sidebar">
      <SidebarHeader className="flex-row items-center py-5 px-4">
        <div className="size-6 rounded-full" />
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
