import { Outlet } from "@tanstack/react-router"
import AppSidebar from "./components/layout/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"

const App = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-h-svh min-w-0 flex-1 p-6 bg-canvas">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  )
}

export default App
