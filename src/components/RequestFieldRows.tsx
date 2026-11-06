import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { useRequestFields } from "@/hooks/useRequestFields"

type Props = Pick<
  ReturnType<typeof useRequestFields>,
  "fields" | "removeField" | "updateField"
> & {
  fieldName: string
}

export default function RequestFieldRows({
  fields,
  removeField,
  updateField,
  fieldName,
}: Props) {
  return (
    <>
      <div className="hidden md:flex items-center gap-2 p-2 text-caption text-color-muted">
        <div className="w-5 shrink-0">
          <span className="sr-only">Enabled</span>
        </div>
        <div className="min-w-0 flex-1">Key</div>
        <div className="min-w-0 flex-1">Value</div>
        <div className="min-w-0 flex-1">Description</div>
        <div className="w-8 shrink-0" />
      </div>

      {fields.map((field) => (
        <div
          key={field.id}
          className="grid grid-cols-2 md:flex md:items-center gap-3 md:gap-2 p-3 md:p-2 bg-surface-subtle border border-border-subtle rounded-md"
        >
          <label className="flex h-11 items-center gap-2 md:h-auto md:w-5 shrink-0">
            <Checkbox
              className="size-5 md:size-4"
              aria-label={`Enable ${fieldName}`}
              checked={field.enabled}
              onCheckedChange={(checked) =>
                updateField(field.id, "enabled", checked === true)
              }
            />
            <span className="text-caption text-color-muted md:sr-only">
              Enabled
            </span>
          </label>
          <label className="col-span-2 min-w-0 md:flex-1">
            <span className="mb-1 block text-caption text-color-muted md:hidden">
              Key
            </span>
            <Input
              className="h-11 md:h-8"
              aria-label={`${fieldName} key`}
              placeholder="Key"
              value={field.key}
              onChange={(event) =>
                updateField(field.id, "key", event.target.value)
              }
            />
          </label>
          <label className="col-span-2 min-w-0 md:flex-1">
            <span className="mb-1 block text-caption text-color-muted md:hidden">
              Value
            </span>
            <Input
              className="h-11 md:h-8"
              aria-label={`${fieldName} value`}
              placeholder="Value"
              value={field.value}
              onChange={(event) =>
                updateField(field.id, "value", event.target.value)
              }
            />
          </label>
          <label className="col-span-2 min-w-0 md:flex-1">
            <span className="mb-1 block text-caption text-color-muted md:hidden">
              Description
            </span>
            <Input
              className="h-11 md:h-8"
              aria-label={`${fieldName} description`}
              placeholder="Description"
              value={field.description}
              onChange={(event) =>
                updateField(field.id, "description", event.target.value)
              }
            />
          </label>
          <Button
            variant="ghost"
            size="icon"
            className="col-start-2 row-start-1 justify-self-end h-11 w-11 md:h-8 md:w-8 shrink-0"
            aria-label={`Delete ${fieldName}`}
            onClick={() => removeField(field.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </>
  )
}
