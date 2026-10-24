import CollectionsPicker from "@/components/collections/CollectionsPicker"
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
import { Loader2Icon, ShieldOff } from "lucide-react"
import { useState, type Dispatch, type SetStateAction } from "react"
import { getReasonPhrase } from "http-status-codes"
import ResponseStatusBar from "@/components/ResponseStatusBar"
import PlaceholderState from "@/components/PlaceholderState"
import {
  methods,
  tabs,
  bodyTypes,
  responseTypes,
  authTypes,
} from "@/constants/request"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/request")({
  component: function RequestPage() {
    const [method, setMethod] = useState("GET")
    const [authType, setAuthType] = useState("no auth")
    const [responseInfo, setResponseInfo] = useState<ResponseInfo | null>(null)
    const [request, setRequest] = useState("")
    const [loading, setLoading] = useState(false)
    const [requestBody, setRequestBody] = useState("")
    const [submittedUrl, setSubmittedUrl] = useState("")
    const [requestSummary, setRequestSummary] = useState("")
    const [bodyType, setBodyType] = useState("json")
    const [queryParams, setQueryParams] = useState<RequestField[]>(() => [
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        description: "",
        enabled: false,
      },
    ])
    const [headers, setHeaders] = useState<RequestField[]>(() => [
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        description: "",
        enabled: false,
      },
    ])
    const [auth, setAuth] = useState({
      token: "",
      username: "",
      password: "",
      apiKeyName: "",
      apiKeyValue: "",
      apiKeyLocation: "header" as "header" | "query-params",
    })

    const selectedMethod = methods.find((item) => item.value === method)
    const sendRequest = async () => {
      setLoading(true)
      setResponseInfo(null)

      const startTime = performance.now()
      try {
        const url = new URL(request)
        const requestHeaders = new Headers()

        queryParams
          .filter((param) => param.enabled && param.key.trim())
          .forEach((param) => {
            url.searchParams.append(param.key, param.value)
          })

        headers
          .filter((header) => header.enabled && header.key.trim())
          .forEach((header) => {
            requestHeaders.append(header.key.trim(), header.value)
          })

        switch (authType) {
          case "bearer":
            requestHeaders.set("Authorization", `Bearer ${auth.token.trim()}`)
            break

          case "basic": {
            const credentials = `${auth.username}:${auth.password}`
            const bytes = new TextEncoder().encode(credentials)
            const encoded = btoa(
              Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""),
            )

            requestHeaders.set("Authorization", `Basic ${encoded}`)
            break
          }

          case "api key": {
            const key = auth.apiKeyName.trim()

            if (!key) {
              throw new Error("API key name is required")
            }

            if (auth.apiKeyLocation === "header") {
              requestHeaders.set(key, auth.apiKeyValue)
            } else {
              url.searchParams.set(key, auth.apiKeyValue)
            }

            break
          }

          case "no auth":
            break
        }

        const canSendBody =
          method !== "GET" && method !== "HEAD" && bodyType !== "none"

        if (canSendBody && !requestHeaders.has("Content-Type")) {
          requestHeaders.set(
            "Content-Type",
            bodyType === "json" ? "application/json" : "text/plain",
          )
        }

        setSubmittedUrl(url.toString())
        const paramCount = url.searchParams.size
        const headerCount = Array.from(requestHeaders.keys()).length
        const bodyLabel =
          canSendBody && requestBody.length > 0
            ? "Request body"
            : "No request body"
        const authorization = requestHeaders.get("Authorization") ?? ""
        const authLabel = /^Bearer\s+\S+/i.test(authorization)
          ? "Bearer auth"
          : /^Basic\s+\S+/i.test(authorization)
            ? "Basic auth"
            : authorization
              ? "Authorization header"
              : "No auth"

        setRequestSummary(
          `${paramCount} query parameters · ${headerCount} headers · ${bodyLabel} · ${authLabel}`,
        )
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          ...(canSendBody ? { body: requestBody } : {}),
        })
        const body = await response.text()

        setResponseInfo({
          duration: Math.round(performance.now() - startTime),
          size: (new Blob([body]).size / 1024).toFixed(2),
          statusLabel: `${response.status} ${getStatusLabel(response.status)}`,
          statusCode: response.status,
          body,
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    const addField = (setFields: Dispatch<SetStateAction<RequestField[]>>) => {
      setFields((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          key: "",
          value: "",
          description: "",
          enabled: true,
        },
      ])
    }

    const removeField = (
      fieldId: string,
      setFields: Dispatch<SetStateAction<RequestField[]>>,
    ) => {
      setFields((previous) => previous.filter((field) => field.id !== fieldId))
    }

    const updateField = <K extends keyof Omit<RequestField, "id">>(
      setFields: Dispatch<SetStateAction<RequestField[]>>,
      id: string,
      field: K,
      value: RequestField[K],
    ) => {
      setFields((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      )
    }

    const getStatusLabel = (code: number): string => {
      try {
        return getReasonPhrase(code)
      } catch {
        return "Unknown Status"
      }
    }

    const handleAuthChange = <K extends keyof typeof auth>(
      field: K,
      value: (typeof auth)[K],
    ) => {
      setAuth((previous) => ({
        ...previous,
        [field]: value,
      }))
    }

    return (
      <div className="h-full flex flex-col pb-16">
        <h1 className="text-color-primary font-semibold text-page-title">
          Request
        </h1>

        {/* Request bar */}
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
          {/* Request configuration tabs */}
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

            {/* Params tab */}
            <TabsContent value="params">
              <RequestFieldsCard
                fields={queryParams}
                addField={() => addField(setQueryParams)}
                removeField={(fieldId) => removeField(fieldId, setQueryParams)}
                updateField={(id, field, value) =>
                  updateField(setQueryParams, id, field, value)
                }
                addButtonLabel="Add parameter"
              />
            </TabsContent>

            {/* Headers tab */}
            <TabsContent value="headers">
              <RequestFieldsCard
                fields={headers}
                addField={() => addField(setHeaders)}
                removeField={(fieldId) => removeField(fieldId, setHeaders)}
                updateField={(id, field, value) =>
                  updateField(setHeaders, id, field, value)
                }
                addButtonLabel="Add header"
              />
            </TabsContent>

            {/* Body tab */}
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
                    value={bodyType}
                    onValueChange={(value) => value && setBodyType(value)}
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
                  {bodyType === "none" && (
                    <PlaceholderState
                      variant="inline"
                      title="This request has no body"
                      description="Select JSON or Text to include a body with your request."
                    />
                  )}
                  {bodyType === "json" && (
                    <JsonEditor
                      readOnly={false}
                      data={requestBody}
                      onChange={setRequestBody}
                    />
                  )}
                  {bodyType === "text" && (
                    <Textarea
                      value={requestBody}
                      onChange={(event) => setRequestBody(event.target.value)}
                      placeholder="Enter your request body..."
                      className="min-h-64 bg-canvas border-border font-mono resize-none"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Auth tab */}
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

                  {/* no auth */}
                  {authType === "no auth" && (
                    <PlaceholderState
                      title="No authentication required"
                      description="This request will be sent without authentication credentials."
                      icon={ShieldOff}
                      variant="inline"
                    />
                  )}

                  {/* Bearer auth */}
                  {authType === "bearer" && (
                    <Field>
                      <FieldLabel
                        className="text-label text-color-secondary"
                        htmlFor="token"
                      >
                        Token
                      </FieldLabel>
                      <Input
                        className="font-mono text-color-accent h-11"
                        placeholder="{{token}}"
                        id="token"
                        value={auth.token}
                        onChange={(e) =>
                          handleAuthChange("token", e.target.value)
                        }
                      />
                    </Field>
                  )}

                  {/* Basic auth */}
                  {authType === "basic" && (
                    <FieldGroup className="flex flex-row">
                      <Field>
                        <FieldLabel
                          className="text-label text-color-secondary"
                          htmlFor="username"
                        >
                          Username
                        </FieldLabel>
                        <Input
                          id="username"
                          className="h-11"
                          value={auth.username}
                          onChange={(e) =>
                            handleAuthChange("username", e.target.value)
                          }
                        />
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
                          value={auth.password}
                          onChange={(e) =>
                            handleAuthChange("password", e.target.value)
                          }
                        />
                      </Field>
                    </FieldGroup>
                  )}

                  {/* API key auth */}
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
                          <Input
                            id="key"
                            className="h-11"
                            value={auth.apiKeyName}
                            onChange={(e) =>
                              handleAuthChange("apiKeyName", e.target.value)
                            }
                          />
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
                            value={auth.apiKeyValue}
                            onChange={(e) =>
                              handleAuthChange("apiKeyValue", e.target.value)
                            }
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
                          value={auth.apiKeyLocation}
                          onValueChange={(value) =>
                            (value === "header" || value === "query-params") &&
                            handleAuthChange("apiKeyLocation", value)
                          }
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

          {/* Request configuration summary */}
          {responseInfo && (
            <Card className="bg-surface mt-4">
              <CardHeader>
                <CardTitle className="text-section-title font-semibold">
                  Request configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-color-secondary text-body mb-4">
                  {requestSummary}
                </p>
                <p className="text-color-accent font-mono text-label">
                  {submittedUrl}
                </p>
              </CardContent>
            </Card>
          )}

          {responseInfo ? (
            <Card className="bg-surface flex-1 min-h-72">
              <ResponseStatusBar
                loading={loading}
                responseInfo={responseInfo}
              />

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
                      onChange={(body) =>
                        setResponseInfo((previous) =>
                          previous ? { ...previous, body } : previous,
                        )
                      }
                      loading={loading}
                      readOnly
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <PlaceholderState
              variant="panel"
              title="No response yet"
              description="Send a request to inspect status, timing, headers, and body."
            />
          )}
        </div>
        <CollectionsPicker />
      </div>
    )
  },
})
