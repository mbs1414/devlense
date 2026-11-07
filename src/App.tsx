import { Outlet } from "@tanstack/react-router"
import AppSidebar from "./components/layout/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"
import AppHeader from "./components/layout/AppHeader"
import MobileNavigation from "./components/layout/MobileNavigation"
import { Toaster } from "./components/ui/sonner"

const App = () => {
  return (
    <>
      <Toaster />
      <SidebarProvider>
        <AppSidebar />

        <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-canvas">
          <AppHeader />

          <main className="min-w-0 flex-1 p-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:p-6">
            <Outlet />
          </main>
          <MobileNavigation />
        </div>
      </SidebarProvider>
    </>
  )
}

export default App
