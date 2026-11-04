import CollectionsPanel from "@/components/CollectionsPanel"
import RequestFieldsCard from "@/components/RequestFieldsCard"
import RequestBar from "@/components/RequestBar"
import RequestBodyCard from "@/components/RequestBodyCard"
import RequestAuthCard from "@/components/RequestAuthCard"
import RequestConfigurationSummary from "@/components/RequestConfigurationSummary"
import ResponsePanel from "@/components/ResponsePanel"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tabs } from "@/constants/request"
import { useCollections } from "@/hooks/useCollections"
import { useEnvironments } from "@/hooks/useEnvironments"
import { useRequestFields } from "@/hooks/useRequestFields"
import { useRequestAuth } from "@/hooks/useRequestAuth"
import { useSendRequest } from "@/hooks/useSendRequest"
import { getRequestVariables } from "@/lib/getRequestVariables"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/request")({
  component: function RequestPage() {
    const { collections, isLoadingCollections } = useCollections()
    const { environments, hasLoaded } = useEnvironments()
    const [selectedCollectionId, setSelectedCollectionId] = useState("")
    const variables = getRequestVariables(environments, selectedCollectionId)
    const [method, setMethod] = useState("GET")
    const [request, setRequest] = useState("")
    const [requestBody, setRequestBody] = useState("")
    const [bodyType, setBodyType] = useState("json")
    const queryParamFields = useRequestFields()
    const headerFields = useRequestFields()
    const { fields: queryParams } = queryParamFields
    const { fields: headers } = headerFields
    const { authType, setAuthType, auth, handleAuthChange, setAuth } =
      useRequestAuth()
    const {
      sendRequest,
      responseInfo,
      setResponseInfo,
      loading,
      submittedUrl,
      requestSummary,
    } = useSendRequest({
      method,
      request,
      requestBody,
      bodyType,
      queryParams,
      headers,
      authType,
      auth,
      variables,
      variablesReady: hasLoaded,
    })

    const handleSelectRequest = (
      selectedRequest: PostmanRequest,
      _item: PostmanItem,
      _path: string,
      collection: PostmanCollection,
    ) => {
      setSelectedCollectionId(collection.databaseId ?? "")

      const toFields = (entries: PostmanHeader[]): RequestField[] =>
        entries.map((entry) => ({
          id: crypto.randomUUID(),
          key: entry.key,
          value: entry.value,
          description: entry.description ?? "",
          enabled: !entry.disabled,
        }))

      const url =
        typeof selectedRequest === "string"
          ? selectedRequest
          : selectedRequest.url

      const rawUrl = typeof url === "string" ? url : (url?.raw ?? "")

      const importedHeaders =
        typeof selectedRequest !== "string" &&
        Array.isArray(selectedRequest.header)
          ? selectedRequest.header
          : []

      const importedQuery =
        typeof url === "object" && url?.query
          ? url.query
          : Array.from(
              new URLSearchParams(rawUrl.match(/\?([^#]*)/)?.[1] ?? ""),
              ([key, value]) => ({ key, value }),
            )

      const body =
        typeof selectedRequest === "string" ? undefined : selectedRequest.body

      const requestAuth =
        typeof selectedRequest === "string" ? undefined : selectedRequest.auth
      const importedAuth =
        !requestAuth || requestAuth.type === "inherit"
          ? collection.auth
          : requestAuth

      const bearerToken = importedAuth?.bearer?.find(
        (entry) => entry.key === "token",
      )?.value

      const contentType = importedHeaders.find(
        (header) =>
          !header.disabled && header.key.toLowerCase() === "content-type",
      )?.value

      setMethod(
        typeof selectedRequest === "string"
          ? "GET"
          : (selectedRequest.method ?? "GET"),
      )

      // Query parameters are supplied separately through queryParamFields.
      setRequest(rawUrl.replace(/\?[^#]*/, ""))

      headerFields.setFields(toFields(importedHeaders))
      queryParamFields.setFields(toFields(importedQuery))

      setRequestBody(body?.raw ?? "")
      setBodyType(
        body?.mode === "raw"
          ? contentType?.toLowerCase().includes("json")
            ? "json"
            : "text"
          : "none",
      )

      setAuthType(importedAuth?.type === "bearer" ? "bearer" : "no auth")
      setAuth({
        token: typeof bearerToken === "string" ? bearerToken : "",
        username: "",
        password: "",
        apiKeyName: "",
        apiKeyValue: "",
        apiKeyLocation: "header",
      })

      setResponseInfo(null)
    }

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          Request
        </h1>

        {/* Request bar */}
        <RequestBar
          method={method}
          setMethod={setMethod}
          request={request}
          setRequest={setRequest}
          sendRequest={sendRequest}
          loading={loading}
          disabled={!hasLoaded}
        />
        <div className="grid grid-cols-[30rem_1fr] gap-6 flex-1">
          <Card className="h-[calc(100svh-152px)] min-h-96 bg-surface py-0">
            <CardContent className="grid min-h-0 flex-1 p-0">
              <CollectionsPanel
                collections={collections}
                isLoadingCollections={isLoadingCollections}
                onSelectRequest={handleSelectRequest}
              />
            </CardContent>
          </Card>
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
                  title="Params"
                  addField={queryParamFields.addField}
                  removeField={queryParamFields.removeField}
                  updateField={queryParamFields.updateField}
                  addButtonLabel="Add parameter"
                />
              </TabsContent>

              {/* Headers tab */}
              <TabsContent value="headers">
                <RequestFieldsCard
                  fields={headers}
                  title="Headers"
                  addField={headerFields.addField}
                  removeField={headerFields.removeField}
                  updateField={headerFields.updateField}
                  addButtonLabel="Add header"
                />
              </TabsContent>

              {/* Body tab */}
              <TabsContent value="body">
                <RequestBodyCard
                  bodyType={bodyType}
                  setBodyType={setBodyType}
                  requestBody={requestBody}
                  setRequestBody={setRequestBody}
                />
              </TabsContent>

              {/* Auth tab */}
              <TabsContent value="auth">
                <RequestAuthCard
                  authType={authType}
                  setAuthType={setAuthType}
                  auth={auth}
                  handleAuthChange={handleAuthChange}
                />
              </TabsContent>
            </Tabs>

            {/* Request configuration summary */}
            {responseInfo && (
              <RequestConfigurationSummary
                requestSummary={requestSummary}
                submittedUrl={submittedUrl}
              />
            )}

            <ResponsePanel
              responseInfo={responseInfo}
              setResponseInfo={setResponseInfo}
              loading={loading}
            />
          </div>
        </div>
      </div>
    )
  },
})
