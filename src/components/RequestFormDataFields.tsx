import { Plus, Trash2 } from "lucide-react"

import PlaceholderState from "@/components/PlaceholderState"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { useFormDataFields } from "@/hooks/useFormDataFields"

type Props = Pick<
  ReturnType<typeof useFormDataFields>,
  "fields" | "addField" | "removeField" | "updateField"
>

export default function RequestFormDataFields({
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
          title="No form data fields yet"
          description="Click Add field to create your first field."
        />
      ) : (
        <>
          <div className="grid grid-cols-[20px_minmax(0,1fr)_80px_minmax(0,1.5fr)_32px] gap-2 items-center p-2 text-caption text-color-muted">
            <div />
            <div>Key</div>
            <div>Type</div>
            <div>Value</div>
            <div />
          </div>
          {fields.map((field) => (
            <div
              key={field.id}
              className="grid grid-cols-[20px_minmax(0,1fr)_80px_minmax(0,1.5fr)_32px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md"
            >
              <Checkbox
                aria-label="Enable form data field"
                checked={field.enabled}
                onCheckedChange={(checked) =>
                  updateField(field.id, "enabled", checked === true)
                }
              />
              <Input
                aria-label="Form data key"
                placeholder="Key"
                value={field.key}
                onChange={(event) =>
                  updateField(field.id, "key", event.target.value)
                }
              />
              <Select
                value={field.type}
                onValueChange={(value: "text" | "file") =>
                  updateField(field.id, "type", value)
                }
              >
                <SelectTrigger
                  aria-label="Form data type"
                  className="w-full h-8!"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
              {field.type === "text" ? (
                <Input
                  aria-label="Form data value"
                  placeholder="Value"
                  value={field.value}
                  onChange={(event) =>
                    updateField(field.id, "value", event.target.value)
                  }
                />
              ) : (
                <div className="min-w-0">
                  <Input
                    type="file"
                    multiple
                    aria-label="Form data files"
                    onChange={(event) =>
                      updateField(
                        field.id,
                        "files",
                        Array.from(event.target.files ?? []),
                      )
                    }
                  />
                  <p className="text-caption text-color-muted break-all mt-1">
                    {field.files.length
                      ? field.files.map((file) => file.name).join(", ")
                      : "Choose local files before sending."}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Delete form data field"
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
