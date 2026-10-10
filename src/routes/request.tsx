import RequestFieldsCard from "@/components/forms/RequestFieldsCard"
import JsonEditor from "@/components/JsonEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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

    const bodyTypes = [
      {
        value: "none",
        label: "None",
      },
      {
        value: "json",
        label: "JSON",
      },
      {
        value: "text",
        label: "Text",
      },
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

          <Input className="h-11 font-mono" placeholder="{{baseUrl}}/users" />

          <Button size="lg">Send</Button>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <Tabs defaultValue="params">
            <TabsList variant="line">
              {tabs.map((tab) => (
                <TabsTrigger
                  className="after:bg-action-primary"
                  key={tab.value}
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="params">
              <RequestFieldsCard addButtonLabel="Add parameter" />
            </TabsContent>

            <TabsContent value="headers">
              <RequestFieldsCard addButtonLabel="Add header" />
            </TabsContent>

            <TabsContent value="body">
              <Card className="bg-surface my-4">
                <CardHeader>
                  <CardTitle className="text-section-title font-semibold">
                    Body
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <ToggleGroup
                    type="single"
                    size="lg"
                    defaultValue="json"
                    variant="default"
                    spacing={1}
                    className="mb-4"
                  >
                    {bodyTypes.map((bodyType) => (
                      <ToggleGroupItem
                        key={bodyType.value}
                        value={bodyType.value}
                        aria-label={bodyType.label}
                        className="bg-action-secondary data-[state=on]:bg-action-primary"
                      >
                        {bodyType.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <JsonEditor />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-surface flex-1 min-h-0">
            <CardContent className="h-full flex flex-col gap-2 rounded-lg justify-center items-center mx-4 border border-border-subtle">
              <p className="font-semibold text-color-primary text-base">
                No response yet
              </p>

              <p className="text-color-secondary text-caption">
                Send a request to inspect status, timing, headers, and body.
              </p>

              <Button variant="secondary" size="lg">
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
})
