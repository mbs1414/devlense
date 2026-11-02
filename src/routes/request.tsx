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
import { useRequestFields } from "@/hooks/useRequestFields"
import { useRequestAuth } from "@/hooks/useRequestAuth"
import { useSendRequest } from "@/hooks/useSendRequest"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/request")({
  component: function RequestPage() {
    const { collections, isLoadingCollections } = useCollections()
    const [method, setMethod] = useState("GET")
    const [request, setRequest] = useState("")
    const [requestBody, setRequestBody] = useState("")
    const [bodyType, setBodyType] = useState("json")
    const queryParamFields = useRequestFields()
    const headerFields = useRequestFields()
    const { fields: queryParams } = queryParamFields
    const { fields: headers } = headerFields
    const { authType, setAuthType, auth, handleAuthChange } = useRequestAuth()
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
    })

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          Request
        </h1>

        {/* Request bar */}
        <RequestBar
          method={method}
          setMethod={setMethod}
          setRequest={setRequest}
          sendRequest={sendRequest}
          loading={loading}
        />
        <div className="grid grid-cols-[30rem_1fr] gap-6 flex-1">
          <Card className="h-[calc(100svh-152px)] min-h-96 bg-surface py-0">
            <CardContent className="grid min-h-0 flex-1 p-0">
              <CollectionsPanel
                collections={collections}
                isLoadingCollections={isLoadingCollections}
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
