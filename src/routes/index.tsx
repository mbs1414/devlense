import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: function RouteComponent() {
    return <div>DevLens</div>
  },
})
