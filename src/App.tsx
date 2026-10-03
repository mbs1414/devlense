import { Outlet } from "@tanstack/react-router"
import AppSidebar from "./components/layout/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"

const App = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
    </>
  )
}

export default App