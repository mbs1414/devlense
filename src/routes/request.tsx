import { Field, FieldGroup } from "@/components/ui/field"
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
    const [method, setMethod] = useState("GET")
    const selectedMethod = methods.find((item) => item.value === method)

    return (
      <div>
        <h1 className="text-color-primary font-semibold text-2xl">Request</h1>
        <div className="flex gap-2 my-4">
          <FieldGroup className="w-full max-w-xs">
            <Field>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="p-3">
                  <SelectValue>
                    <span className={selectedMethod?.className}>{method}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  position="item-aligned"
                  className="bg-input ring ring-ring"
                >
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
            </Field>
          </FieldGroup>
          <Input placeholder="{{baseUrl}}/users" />
        </div>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    )
  },
})
