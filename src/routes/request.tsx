import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/request")({
  component: function RequestPage() {
    return <div>Request</div>
  },
})
