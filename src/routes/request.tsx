import CollectionsPanel from "@/components/CollectionsPanel"
import RequestFieldsCard from "@/components/RequestFieldsCard"
import RequestBar from "@/components/RequestBar"
import RequestBodyCard from "@/components/RequestBodyCard"
import RequestAuthCard from "@/components/RequestAuthCard"
import RequestConfigurationSummary from "@/components/RequestConfigurationSummary"
import ResponsePanel from "@/components/ResponsePanel"
import CollectionsSplitPanels from "@/components/CollectionsSplitPanels"
import CollectionImportDropZone from "@/components/CollectionImportDropZone"
import { Card, CardContent } from "@/components/ui/card"
import ImportCollectionsButton, {
  CollectionImportFeedback,
} from "@/components/ImportCollectionsButton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tabs } from "@/constants/request"
import { useCollections } from "@/hooks/useCollections"
import { useImportPostmanCollection } from "@/hooks/useImportPostmanCollection"
import { useEnvironments } from "@/hooks/useEnvironments"
import { useRequestFields } from "@/hooks/useRequestFields"
import { useFormDataFields } from "@/hooks/useFormDataFields"
import { useRequestAuth } from "@/hooks/useRequestAuth"
import { useSendRequest } from "@/hooks/useSendRequest"
import { getRequestVariables } from "@/lib/getRequestVariables"
import { getEnvironmentBearerToken } from "@/lib/getEnvironmentBearerToken"
import { getRequestAtPath } from "@/lib/collectionRequestPath"
import { createFileRoute, useLocation } from "@tanstack/react-router"
import { useEffect, useEffectEvent, useState } from "react"

export const Route = createFileRoute("/request")({
  component: function RequestPage() {
    const requestToOpen = useLocation({
      select: (location) => location.state.requestToOpen,
    })
    const { collectionId, requestPath } = requestToOpen ?? {}
    const navigate = Route.useNavigate()
    const { collections, isLoadingCollections, addCollection } = useCollections()
    const [environmentReloadKey, setEnvironmentReloadKey] = useState(0)
    const {
      importCollectionFiles,
      isImporting,
      importMessage,
      importErrors,
    } = useImportPostmanCollection(addCollection)
    const {
      environments,
      hasLoaded,
      error: environmentError,
    } = useEnvironments({
      showToasts: false,
      reloadKey: environmentReloadKey,
    })
    const handleImportCollectionFiles = async (files: File[]) => {
      await importCollectionFiles(files)
      setEnvironmentReloadKey((previous) => previous + 1)
    }
    const [selectedCollectionId, setSelectedCollectionId] = useState("")
    const [requestName, setRequestName] = useState("")
    const collectionName =
      collections.find(
        (collection) => collection.databaseId === selectedCollectionId,
      )?.info.name ?? ""
    const variables = getRequestVariables(environments, selectedCollectionId)
    const activeEnvironment = environments.find(
      (environment) => environment.active,
    )
    const environmentBearerToken = getEnvironmentBearerToken(activeEnvironment)
    const [method, setMethod] = useState("GET")
    const [request, setRequest] = useState("")
    const [requestBody, setRequestBody] = useState("")
    const [bodyType, setBodyType] = useState("json")
    const queryParamFields = useRequestFields()
    const headerFields = useRequestFields()
    const encodedBodyFields = useRequestFields()
    const formDataFields = useFormDataFields()
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
      error: requestError,
      setError: setRequestError,
    } = useSendRequest({
      method,
      request,
      requestBody,
      bodyType,
      encodedBodyFields: encodedBodyFields.fields,
      formDataFields: formDataFields.fields,
      queryParams,
      headers,
      authType,
      auth,
      variables,
      variablesReady: hasLoaded,
      requestName,
      collectionName,
      environmentBearerToken,
    })

    const handleSelectRequest = (
      selectedRequest: PostmanRequest,
      item: PostmanItem,
      _path: string,
      collection: PostmanCollection,
    ) => {
      setSelectedCollectionId(collection.databaseId ?? "")
      setRequestName(item.name ?? "")
      setRequestError("")

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
      encodedBodyFields.setFields(toFields(body?.urlencoded ?? []))
      formDataFields.setFields(
        (body?.formdata ?? []).map((field) => ({
          id: crypto.randomUUID(),
          key: field.key,
          value: field.value ?? "",
          description: field.description ?? "",
          enabled: !field.disabled,
          type: field.type === "file" ? "file" : "text",
          files: [],
        })),
      )

      setRequestBody(body?.raw ?? "")
      let importedBodyType = "none"
      if (body?.mode === "formdata") importedBodyType = "formdata"
      else if (body?.mode === "urlencoded") importedBodyType = "encoded"
      else if (body?.mode === "raw") {
        importedBodyType = contentType?.toLowerCase().includes("json")
          ? "json"
          : "text"
      }
      setBodyType(importedBodyType)

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

    const openSelectedRequest = useEffectEvent(
      (collection: PostmanCollection, item: PostmanItem) => {
        if (item.request != null)
          handleSelectRequest(item.request, item, "", collection)
        else
          setRequestError(
            "This item is not a request. Select a request from the collection.",
          )
      },
    )
    const reportMissingRequest = useEffectEvent(() => {
      setRequestError(
        "This request is no longer available. Select a request from the collection.",
      )
    })

    useEffect(() => {
      if (isLoadingCollections || !collectionId || requestPath === undefined)
        return
      const collection = collections.find(
        (collection) => collection.databaseId === collectionId,
      )
      const item = collection
        ? getRequestAtPath(collection.item, requestPath)
        : undefined
      if (collection && item) openSelectedRequest(collection, item)
      else reportMissingRequest()
    }, [collections, isLoadingCollections, collectionId, requestPath])

    return (
      <CollectionImportDropZone
        className="h-full min-w-0 flex flex-col"
        onImport={handleImportCollectionFiles}
        disabled={isImporting || isLoadingCollections || !hasLoaded}
      >
        <h1 className="hidden md:block text-color-primary font-semibold text-page-title">
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
          variables={variables}
        />
        <CollectionImportFeedback message={importMessage} errors={importErrors} />
        <CollectionsSplitPanels
          collections={
            <Card className="h-112 xl:sticky xl:top-6 xl:h-[min(40rem,max(20rem,calc(100dvh-9.5rem)))] min-w-0 bg-surface py-0 ring-0 border border-border-subtle">
              <CardContent className="grid min-h-0 flex-1 p-0">
                <CollectionsPanel
                  actions={
                    <ImportCollectionsButton
                      compact
                      onImport={handleImportCollectionFiles}
                      isImporting={isImporting}
                      disabled={isLoadingCollections || !hasLoaded}
                    />
                  }
                  collections={collections}
                  isLoadingCollections={isLoadingCollections}
                  onSelectRequest={(request, item, path, collection) => {
                    handleSelectRequest(request, item, path, collection)
                    if (requestToOpen)
                      void navigate({
                        state: (previous) => ({
                          ...previous,
                          requestToOpen: undefined,
                        }),
                        replace: true,
                      })
                  }}
                />
              </CardContent>
            </Card>
          }
        >
          <div className="flex flex-col gap-4 min-h-0 min-w-0">
            {/* Request configuration tabs */}
            <Tabs defaultValue="params" className="min-w-0">
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
              <TabsContent value="body" className="min-w-0">
                <RequestBodyCard
                  bodyType={bodyType}
                  setBodyType={setBodyType}
                  requestBody={requestBody}
                  setRequestBody={setRequestBody}
                  encodedBodyFields={encodedBodyFields}
                  formDataFields={formDataFields}
                />
              </TabsContent>

              {/* Auth tab */}
              <TabsContent value="auth">
                <RequestAuthCard
                  authType={authType}
                  setAuthType={setAuthType}
                  auth={auth}
                  handleAuthChange={handleAuthChange}
                  environmentToken={getEnvironmentBearerToken(
                    activeEnvironment,
                    true,
                  )}
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

            {(environmentError || requestError) && (
              <p
                role="alert"
                className="text-caption text-status-error-fg wrap-break-word"
              >
                {environmentError || requestError}
              </p>
            )}

            <ResponsePanel
              responseInfo={responseInfo}
              setResponseInfo={setResponseInfo}
              loading={loading}
            />
          </div>
        </CollectionsSplitPanels>
      </CollectionImportDropZone>
    )
  },
})
