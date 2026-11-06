import JsonEditor from "@/components/JsonEditor"
import RequestEncodedFields from "@/components/RequestEncodedFields"
import RequestFormDataFields from "@/components/RequestFormDataFields"
import type { useFormDataFields } from "@/hooks/useFormDataFields"
import PlaceholderState from "@/components/PlaceholderState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"
import { bodyTypes } from "@/constants/request"
import type { useRequestFields } from "@/hooks/useRequestFields"

interface Props {
  bodyType: string
  setBodyType: (bodyType: string) => void
  requestBody: string
  setRequestBody: (requestBody: string) => void
  encodedBodyFields: ReturnType<typeof useRequestFields>
  formDataFields: ReturnType<typeof useFormDataFields>
}

export default function RequestBodyCard({
  bodyType,
  setBodyType,
  requestBody,
  setRequestBody,
  encodedBodyFields,
  formDataFields,
}: Props) {
  return (
    <Card className="bg-surface mt-4 min-w-0">
      <CardHeader>
        <CardTitle className="text-section-title font-semibold">Body</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0">
        <ToggleGroup
          type="single"
          size="lg"
          value={bodyType}
          onValueChange={(value) => value && setBodyType(value)}
          variant="default"
          spacing={1}
          className="mb-4 flex-wrap"
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
            description="Select a body type to include a body with your request."
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
        {bodyType === "encoded" && (
          <RequestEncodedFields {...encodedBodyFields} />
        )}
        {bodyType === "formdata" && (
          <RequestFormDataFields {...formDataFields} />
        )}
      </CardContent>
    </Card>
  )
}
