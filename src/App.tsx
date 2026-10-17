import { Outlet } from "@tanstack/react-router"
import AppSidebar from "./components/layout/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"
import AppHeader from "./components/layout/AppHeader"

const App = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-canvas">
          <AppHeader />

          <main className="min-w-0 flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </>
  )
}

export default App
