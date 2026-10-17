import { SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

const AppHeader = () => {
  return (
    <header className="sticky text-color-primary top-0 z-20 flex shrink-0 py-3 px-2 items-center border-b border-border-subtle bg-surface md:hidden space-x-2">
      <SidebarTrigger>
        <Menu className="size-5" />
      </SidebarTrigger>
      <span className="font-semibold">DevLens</span>
    </header>
  )
}

export default AppHeader
