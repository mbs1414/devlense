import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createFileRoute } from "@tanstack/react-router"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/request")({
  component: function RequestPage() {
    const methods = [
      { value: "GET", className: "text-method-get-fg" },
      { value: "POST", className: "text-method-post-fg" },
      { value: "PUT", className: "text-method-put-fg" },
      { value: "PATCH", className: "text-method-patch-fg" },
      { value: "DELETE", className: "text-method-delete-fg" },
    ]

    const tabs = [
      { value: "params", label: "Params" },
      { value: "headers", label: "Headers" },
      { value: "body", label: "Body" },
      { value: "auth", label: "Auth" },
    ]

    const [method, setMethod] = useState("GET")

    const selectedMethod = methods.find((item) => item.value === method)

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          Request
        </h1>

        <div className="flex gap-2 my-4 items-center">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue>
                <span className={`${selectedMethod?.className} font-mono w-14`}>
                  {method}
                </span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent position="popper">
              <SelectGroup>
                {methods.map((method) => (
                  <SelectItem
                    value={method.value}
                    className={`${method.className} focus:bg-hover`}
                    key={method.value}
                  >
                    {method.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input className="h-11" placeholder="{{baseUrl}}/users" />

          <Button size="lg">Send</Button>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <Tabs defaultValue="params">
            <TabsList variant="line">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="params">
              <Card className="bg-surface my-4">
                <CardHeader>
                  <CardTitle className="text-section-title font-semibold">
                    Params
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 text-caption text-color-muted">
                    <div>Enabled</div>
                    <div>Key</div>
                    <div>Value</div>
                    <div>Description</div>
                    <div />
                  </div>

                  <div className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md">
                    <Checkbox />

                    <Input placeholder="page" />

                    <Input placeholder="1" />

                    <Input placeholder="Pagination page" />

                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button variant="secondary" size="lg">
                    <Plus className="h-4 w-4" />
                    Add parameter
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-surface flex-1 min-h-0">
            <CardContent className="h-full">test</CardContent>
          </Card>
        </div>
      </div>
    )
  },
})
