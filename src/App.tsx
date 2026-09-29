import AppSidebar from "./components/layout/AppSidebar"
import { SidebarProvider } from "./components/ui/sidebar"

const App = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div>App</div>
      </SidebarProvider>
    </>
  )
}

export default App
