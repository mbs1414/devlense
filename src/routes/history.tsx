import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/history")({
  component: function HistoryPage() {
    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          History
        </h1>

        <div className="flex items-center my-4">
          <Input placeholder="Search requests…" className="flex-1 h-11" />

          <div className="flex-1 flex justify-end gap-2">
            <Button size="lg" variant="secondary">
              All methods
            </Button>
            <Button size="lg" variant="secondary">
              Clear history
            </Button>
          </div>
        </div>

        <Card className="bg-surface flex-1">
          {/* history content */}
          {/* <CardContent>
            <div>
              <p className="text-label text-color-secondary">Today</p>

              <div className="flex items-center justify-between my-3 hover:bg-active transition-all duration-200 rounded-md p-2 group">
                <div className="flex items-center gap-4 font-mono">
                  <Badge
                    className="p-3 text-sm text-get rounded-md"
                    variant="info"
                  >
                    GET
                  </Badge>

                  <div className="text-color-primary font-thin group-hover:font-semibold">
                    /users
                  </div>
                </div>

                <div className="flex gap-4 text-caption">
                  <div className="text-get">200</div>
                  <div className="text-color-muted">184 ms</div>
                </div>
              </div>

              <Separator />
            </div>
          </CardContent> */}

          <CardContent className="h-full flex flex-col gap-4 rounded-lg justify-center items-center mx-4 border border-border-subtle min-h-36">
            <p className="font-semibold text-color-primary text-base">
              No request history
            </p>

            <p className="text-color-secondary text-caption">
              Requests you send will appear here, grouped by date.
            </p>

            <Button variant="secondary" size="lg">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  },
})
