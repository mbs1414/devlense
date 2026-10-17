import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { createFileRoute } from "@tanstack/react-router"
import { Eye, Plus, Trash2 } from "lucide-react"

export const Route = createFileRoute("/environments")({
  component: function EnvironmentsPage() {
    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          Environments
        </h1>

        <div className="flex items-center justify-between my-4">
          <Button variant="secondary">Development</Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary">Rename</Button>
            <Button>
              <Plus className="h-4 w-4" />
              <span>New environment</span>
            </Button>
          </div>
        </div>

        <Card className="flex-1 bg-surface">
          <CardHeader className="font-mono text-label text-color-accent">
            {`Use variables in requests: {{baseUrl}}/users/{{userId}}`}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 items-center p-1 text-caption text-color-muted">
              <div>Variable</div>
              <div>Value</div>
            </div>
            <div className="grid grid-cols-[20px_repeat(2,minmax(0,1fr))_86px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md">
              <Checkbox />
              <Input placeholder="token" />
              <Input type="password" />
              <div>
                <Button variant="ghost">
                  <Eye className="size-4" />
                </Button>
                <Button variant="ghost">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <Button variant="secondary" size="lg">
              <Plus className="size-4" />
              Add variable
            </Button>
          </CardContent>
        </Card>

        {/* no environment */}
        {/* <Card className="bg-surface flex-1 min-h-56">
          <CardContent className="h-full flex flex-col gap-4 rounded-lg justify-center items-center mx-4 border border-border-subtle">
            <p className="font-semibold text-color-primary text-base">
              No variables in Development
            </p>

            <p className="text-color-secondary text-caption">
              {`Add baseUrl, token, and other values to reuse them as {{variableName}}.`}
            </p>

            <Button variant="secondary" size="lg">
              Try again
            </Button>
          </CardContent>
        </Card> */}
      </div>
    )
  },
})
