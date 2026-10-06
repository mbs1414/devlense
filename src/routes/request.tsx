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
      <div>
        <h1 className="text-color-primary font-semibold text-2xl">Request</h1>
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
                ))}{" "}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input className="font-mono w-" placeholder="{{baseUrl}}/users" />
          <Button size="lg">Send</Button>
        </div>
        <Tabs defaultValue="params">
          <TabsList variant="line" className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="params">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-sm">Params</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Table header */}
                <div className="grid grid-cols-[40px_1fr_1fr_1.5fr_40px] gap-2 text-sm text-muted-foreground">
                  <div>Enabled</div>
                  <div>Key</div>
                  <div>Value</div>
                  <div>Description</div>
                  <div />
                </div>

                {/* Param row */}
                <div className="grid grid-cols-[40px_1fr_1fr_1.5fr_40px] items-center gap-2 rounded-md border bg-muted/20 p-2">
                  <Checkbox />

                  <Input defaultValue="page" className="h-8" />

                  <Input defaultValue="1" className="h-8" />

                  <Input defaultValue="Pagination page" className="h-8" />

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="secondary" size="sm" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add parameter
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  },
})
