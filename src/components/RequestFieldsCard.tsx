import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PlaceholderState from "@/components/PlaceholderState"
import RequestFieldRows from "@/components/RequestFieldRows"
import type { useRequestFields } from "@/hooks/useRequestFields"

type Props = Pick<
  ReturnType<typeof useRequestFields>,
  "fields" | "addField" | "removeField" | "updateField"
> & {
  title: string
  addButtonLabel: string
}

const RequestFieldsCard = ({
  title,
  addButtonLabel,
  fields,
  addField,
  removeField,
  updateField,
}: Props) => {
  const fieldName = title === "Headers" ? "header" : "parameter"

  return (
    <Card className="bg-surface mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-section-title font-semibold">
          {title}
        </CardTitle>
        <Button variant="secondary" size="lg" onClick={addField}>
          <Plus className="size-4" />
          {addButtonLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.length === 0 ? (
          <PlaceholderState
            variant="inline"
            title={`No ${fieldName}s yet`}
            description={`Click ${addButtonLabel} to create your first ${fieldName}.`}
          />
        ) : (
          <RequestFieldRows
            fields={fields}
            removeField={removeField}
            updateField={updateField}
            fieldName={fieldName}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default RequestFieldsCard
