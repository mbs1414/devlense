import { Plus } from "lucide-react"

import PlaceholderState from "@/components/PlaceholderState"
import RequestFieldRows from "@/components/RequestFieldRows"
import { Button } from "@/components/ui/button"
import type { useRequestFields } from "@/hooks/useRequestFields"

type Props = Pick<
  ReturnType<typeof useRequestFields>,
  "fields" | "addField" | "removeField" | "updateField"
>

export default function RequestEncodedFields({
  fields,
  addField,
  removeField,
  updateField,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button variant="secondary" size="lg" onClick={addField}>
          <Plus className="size-4" />
          Add field
        </Button>
      </div>
      {fields.length === 0 ? (
        <PlaceholderState
          variant="inline"
          title="No encoded fields yet"
          description="Click Add field to create your first field."
        />
      ) : (
        <RequestFieldRows
          fields={fields}
          removeField={removeField}
          updateField={updateField}
          fieldName="encoded field"
        />
      )}
    </div>
  )
}
