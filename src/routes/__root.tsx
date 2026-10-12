import App from "@/App"
import { Button } from "@/components/ui/button"
import { createRootRoute, Link } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: App,
  notFoundComponent: () => (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-page-title font-semibold text-color-primary">
        Page not found
      </h1>
      <p className="text-body text-color-secondary">
        This page does not exist yet.
      </p>
      <Button asChild>
        <Link to="/request">Go to Request</Link>
      </Button>
    </div>
  ),
})
