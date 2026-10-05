import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createFileRoute } from "@tanstack/react-router"
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
          <TabsList variant="line">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    )
  },
})
