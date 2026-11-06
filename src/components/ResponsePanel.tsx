import JsonEditor from "@/components/JsonEditor"
import PlaceholderState from "@/components/PlaceholderState"
import ResponseStatusBar from "@/components/ResponseStatusBar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { responseTypes } from "@/constants/request"
import type { Dispatch, SetStateAction } from "react"

interface Props {
  responseInfo: ResponseInfo | null
  setResponseInfo: Dispatch<SetStateAction<ResponseInfo | null>>
  loading: boolean
}

export default function ResponsePanel({
  responseInfo,
  setResponseInfo,
  loading,
}: Props) {
  return responseInfo ? (
    <Card className="bg-surface flex-1 min-h-72">
      <ResponseStatusBar loading={loading} responseInfo={responseInfo} />

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
            {responseInfo.imageUrl ? (
              <div className="flex min-h-64 items-center justify-center overflow-auto rounded-lg border border-border bg-surface-subtle p-4">
                <img
                  src={responseInfo.imageUrl}
                  alt="Response preview"
                  className="max-h-96 max-w-full object-contain"
                />
              </div>
            ) : (
              <JsonEditor
                data={responseInfo.body}
                onChange={(body) =>
                  setResponseInfo((previous) =>
                    previous ? { ...previous, body } : previous,
                  )
                }
                loading={loading}
                readOnly
              />
            )}
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
  )
}
