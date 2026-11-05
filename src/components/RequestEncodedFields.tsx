import { Plus, Trash2 } from "lucide-react"

import PlaceholderState from "@/components/PlaceholderState"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
        <>
          <div className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 text-caption text-color-muted">
            <div />
            <div>Key</div>
            <div>Value</div>
            <div>Description</div>
            <div />
          </div>

          {fields.map((field) => (
            <div
              key={field.id}
              className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md"
            >
              <Checkbox
                aria-label="Enable encoded field"
                checked={field.enabled}
                onCheckedChange={(checked) =>
                  updateField(field.id, "enabled", checked === true)
                }
              />
              <Input
                aria-label="Encoded field key"
                placeholder="Key"
                value={field.key}
                onChange={(event) =>
                  updateField(field.id, "key", event.target.value)
                }
              />
              <Input
                aria-label="Encoded field value"
                placeholder="Value"
                value={field.value}
                onChange={(event) =>
                  updateField(field.id, "value", event.target.value)
                }
              />
              <Input
                aria-label="Encoded field description"
                placeholder="Description"
                value={field.description}
                onChange={(event) =>
                  updateField(field.id, "description", event.target.value)
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Delete encoded field"
                onClick={() => removeField(field.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
