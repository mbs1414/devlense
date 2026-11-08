import { useLocation } from "@tanstack/react-router"
import { CodeXml } from "lucide-react"

import { routes } from "@/constants/sidebar-items"

const AppHeader = () => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const currentRoute = routes.find((route) => route.to === pathname)
  const Icon = currentRoute?.icon

  return (
    <header className="sticky text-color-primary top-0 z-20 flex h-15 shrink-0 px-4 items-center justify-between gap-4 border-b border-border-subtle bg-surface md:hidden">
      <div className="flex shrink-0 items-center gap-2.5">
        <CodeXml className="size-5 text-action-primary" aria-hidden="true" />
        <span className="font-semibold">DevLens</span>
      </div>
      {currentRoute && Icon && (
        <div className="flex min-w-0 items-center gap-2 rounded-lg bg-action-primary/10 px-2.5 py-1.5 text-color-accent">
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          <h1 className="truncate text-label font-medium">{currentRoute.name}</h1>
        </div>
      )}
    </header>
  )
}

export default AppHeader
