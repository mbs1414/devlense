import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          Collections
        </h1>

        <div className="flex items-center justify-between my-4">
          <p className="text-color-secondary text-body">
            Saved requests are grouped by purpose, not placed in the global
            sidebar.
          </p>

          <Button>
            <Plus className="h-4 w-4" />
            <span>New Collection</span>
          </Button>
        </div>

        <Card className="flex-1 bg-surface">
          <CardContent></CardContent>
        </Card>
      </div>
    )
  },
})
