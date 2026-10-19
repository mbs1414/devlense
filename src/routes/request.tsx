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
import { Loader2Icon } from "lucide-react"
import { useState } from "react"

export interface ResponseInfo {
  duration: number
  size: string
  status: string
  body: string
}

const statusLabels: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
}

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
      { value: "none", label: "None" },
      { value: "json", label: "JSON" },
      { value: "text", label: "Text" },
    ]

    const responseTypes = [
      { value: "body", label: "Body" },
      { value: "headers", label: "Headers" },
      { value: "pretty", label: "Pretty" },
      { value: "raw", label: "Raw" },
    ]

    const authTypes = [
      { value: "no auth", label: "No Auth" },
      { value: "bearer", label: "Bearer" },
      { value: "basic", label: "Basic" },
      { value: "api key", label: "API Key" },
    ]

    const [method, setMethod] = useState("GET")
    const [authType, setAuthType] = useState("bearer")
    const [responseInfo, setResponseInfo] = useState<ResponseInfo | null>(null)
    const [request, setRequest] = useState("")
    const [loading, setLoading] = useState(false)

    const [queryParams, setQueryParams] = useState<
      { key: string; value: string }[]
    >([])

    const [headers, setHeaders] = useState<{ key: string; value: string }[]>([])

    const [requestBody, setRequestBody] = useState("")

    const sendRequest = async () => {
      setLoading(true)
      setResponseInfo(null)

      const startTime = performance.now()

      try {
        const response = await fetch(request, {
          method,
        })

        const body = await response.text()

        const statusText =
          response.statusText || statusLabels[response.status] || ""

        setResponseInfo({
          duration: Math.round(performance.now() - startTime),
          size: (new Blob([body]).size / 1024).toFixed(2),
          status: `${response.status} ${statusText}`,
          body,
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

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

          <Input
            className="h-11 font-mono bg-input"
            placeholder="{{baseUrl}}/users"
            onChange={(event) => setRequest(event.target.value)}
          />

          <Button size="lg" onClick={sendRequest} disabled={loading}>
            {loading && <Loader2Icon className="size-4 animate-spin" />}
            {loading ? "Sending..." : "Send"}
          </Button>
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

                  <JsonEditor readOnly={false} />
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
                    {authTypes.map((auth) => (
                      <ToggleGroupItem
                        key={auth.value}
                        value={auth.value}
                        aria-label={auth.label}
                        className="bg-action-secondary data-[state=on]:bg-action-primary"
                      >
                        {auth.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>

                  {authType === "bearer" && (
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
                  )}

                  {authType === "basic" && (
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

                        <Input id="password" type="password" className="h-11" />
                      </Field>
                    </FieldGroup>
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

          {responseInfo && (
            <Card className="bg-surface mt-4">
              <CardHeader>
                <CardTitle className="text-section-title font-semibold">
                  Request configuration
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-color-secondary text-body mb-4">
                  {queryParams.filter((item) => item.key.trim()).length} query
                  parameters ·{" "}
                  {headers.filter((item) => item.key.trim()).length} headers ·{" "}
                  {requestBody.trim() ? "Request body" : "No request body"} ·{" "}
                  {
                    {
                      "no auth": "No auth",
                      bearer: "Bearer auth",
                      basic: "Basic auth",
                      "api key": "API key auth",
                    }[authType]
                  }
                </p>

                <p className="text-color-accent font-mono text-label">
                  {request}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-surface flex-1 min-h-72">
            {responseInfo && (
              <div className="flex items-center justify-between bg-surface-subtle border border-border-subtle rounded-md mx-4 p-2">
                <div className="text-status-success-fg flex items-center gap-2">
                  <div className="rounded-full size-2 bg-status-success-fg" />
                  <div>{responseInfo.status}</div>
                </div>

                <div className="text-color-secondary text-caption flex gap-4">
                  <div>{`${responseInfo.duration} ms`}</div>
                  <div>{`${responseInfo.size} KB`}</div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-between bg-surface-subtle border border-border-subtle rounded-md mx-4 p-2">
                <div className="text-status-info-fg flex items-center gap-2">
                  <div className="rounded-full size-2 bg-status-info-fg" />
                  <div>Loading</div>
                </div>

                <div className="text-color-secondary text-caption flex gap-4">
                  <div>— ms</div>
                  <div>— KB</div>
                </div>
              </div>
            )}

            <CardContent>
              <Tabs defaultValue="body">
                <TabsList variant="line">
                  {responseTypes.map((responseTab) => (
                    <TabsTrigger
                      className="after:bg-action-primary"
                      key={responseTab.value}
                      value={responseTab.value}
                    >
                      {responseTab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="body" className="mt-4">
                  <JsonEditor
                    data={responseInfo?.body}
                    loading={loading}
                    readOnly
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
})
