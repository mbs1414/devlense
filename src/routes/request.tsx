import RequestFieldsCard from "@/components/forms/RequestFieldsCard"
import JsonEditor from "@/components/JsonEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

    const authTypes = [
      {
        value: "no auth",
        label: "No Auth",
      },
      {
        value: "bearer",
        label: "Bearer",
      },
      {
        value: "basic",
        label: "Basic",
      },
      {
        value: "api key",
        label: "API Key",
      },
    ]

    const [method, setMethod] = useState("GET")
    const [authType, setAuthType] = useState("bearer")
    const [response, setResponse] = useState(false)

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
              <Card className="bg-surface mt-4">
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
            <TabsContent value="auth">
              <Card className="bg-surface mt-4">
                <CardHeader>
                  <CardTitle className="text-section-title font-semibold">
                    Auth · Bearer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ToggleGroup
                    type="single"
                    size="lg"
                    defaultValue={authType}
                    onValueChange={(value) => value && setAuthType(value)}
                    variant="default"
                    spacing={1}
                    className="mb-4"
                  >
                    {authTypes.map((bodyType) => (
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
                  {authType === "bearer" && (
                    <>
                      <Field>
                        <FieldLabel
                          className="text-label text-color-secondary"
                          htmlFor="token"
                        >
                          Token
                        </FieldLabel>
                        <Input
                          id="token"
                          className="font-mono text-color-accent h-11"
                          placeholder="{{token}}"
                        />
                      </Field>
                    </>
                  )}
                  {authType === "basic" && (
                    <>
                      <FieldGroup className="flex flex-row">
                        <Field>
                          <FieldLabel
                            className="text-label text-color-secondary"
                            htmlFor="username"
                          >
                            Username
                          </FieldLabel>
                          <Input id="username" className="h-11" />
                        </Field>
                        <Field>
                          <FieldLabel
                            className="text-label text-color-secondary"
                            htmlFor="password"
                          >
                            Password
                          </FieldLabel>
                          <Input
                            id="password"
                            type="password"
                            className="h-11"
                          />
                        </Field>
                      </FieldGroup>
                    </>
                  )}
                  {authType === "api key" && (
                    <>
                      <FieldGroup className="flex flex-row">
                        <Field>
                          <FieldLabel
                            className="text-label text-color-secondary"
                            htmlFor="key"
                          >
                            Key
                          </FieldLabel>
                          <Input id="key" className="h-11" />
                        </Field>
                        <Field>
                          <FieldLabel
                            className="text-label text-color-secondary"
                            htmlFor="value"
                          >
                            Value
                          </FieldLabel>
                          <Input
                            id="value"
                            className="font-mono text-color-accent h-11"
                          />
                        </Field>
                      </FieldGroup>
                      <div className="flex items-center gap-2 mt-4 text-color-secondary">
                        <span className="shrink-0 text-sm font-medium">
                          Add to:
                        </span>

                        <RadioGroup
                          defaultValue="header"
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center gap-1">
                            <RadioGroupItem id="header" value="header" />
                            <Label htmlFor="header">Header</Label>
                          </div>

                          <div className="flex items-center gap-1">
                            <RadioGroupItem
                              id="query-params"
                              value="query-params"
                            />
                            <Label
                              htmlFor="query-params"
                              className="whitespace-nowrap"
                            >
                              Query Params
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {response && (
            <Card className="bg-surface mt-4">
              <CardHeader>
                <CardTitle className="text-section-title font-semibold">
                  Request configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-color-secondary text-body mb-4">
                  2 query parameters · 2 headers · No request body · Bearer auth
                </p>
                <p className="text-color-accent font-mono text-label">{`{{baseUrl}}/users?page=1&limit=20`}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-surface flex-1 min-h-56">
            <div className="flex items-center justify-between bg-surface-subtle border border-border-subtle rounded-md mx-2 p-2">
              <div className="text-status-success-fg flex items-center gap-2">
                <div className="rounded-full size-2 bg-success"></div>
                <div>200 OK</div>
              </div>
              <div className="text-color-secondary text-caption flex gap-4">
                <div>184 ms</div>
                <div>1.24 KB</div>
              </div>
            </div>
          </Card>

          <Card className="bg-surface flex-1 min-h-56">
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
