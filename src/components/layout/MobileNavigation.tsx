import { Link, useLocation } from "@tanstack/react-router"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { useState } from "react"

import { routes } from "@/constants/sidebar-items"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function MobileNavigation() {
  const { isMobile } = useSidebar()

  return isMobile ? <PhoneNavigation /> : null
}

function PhoneNavigation() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const [open, setOpen] = useState(false)
  const primaryRoutes = routes.slice(0, 3)
  const moreRoutes = routes.slice(3)
  const moreActive = open || moreRoutes.some((route) => route.to === pathname)
  const itemClass =
    "flex min-w-0 h-14 flex-col items-center justify-center gap-1 rounded-lg text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
  const activeClass = "bg-sidebar-accent text-color-accent font-semibold"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t border-border-subtle bg-sidebar px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden"
      >
        {primaryRoutes.map((route) => {
          const Icon = route.icon
          const active = pathname === route.to

          return (
            <Link
              key={route.to}
              to={route.to}
              aria-current={active ? "page" : undefined}
              className={cn(itemClass, active ? activeClass : "text-color-secondary")}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{route.name}</span>
            </Link>
          )
        })}
        <SheetTrigger
          className={cn(itemClass, moreActive ? activeClass : "text-color-secondary")}
        >
          <MoreHorizontal className="size-5" aria-hidden="true" />
          <span>More</span>
        </SheetTrigger>
      </nav>
      <SheetContent
        side="bottom"
        aria-describedby={undefined}
        className="data-[side=bottom]:bottom-[calc(4.5rem+env(safe-area-inset-bottom))] rounded-t-2xl border-border-subtle bg-surface px-4 pb-6"
      >
        <SheetHeader className="px-0 pt-5 pb-0">
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <nav aria-label="More navigation" className="grid gap-2">
          {moreRoutes.map((route) => {
            const Icon = route.icon
            const active = pathname === route.to

            return (
              <SheetClose key={route.to} asChild>
                <Link
                  to={route.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-lg border border-border-subtle px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                    active ? activeClass : "text-color-primary hover:bg-surface-subtle",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="flex-1">{route.name}</span>
                  <ChevronRight className="size-4 text-color-muted" aria-hidden="true" />
                </Link>
              </SheetClose>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
