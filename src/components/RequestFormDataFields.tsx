import { Plus, Trash2 } from "lucide-react"

import PlaceholderState from "@/components/PlaceholderState"
import FormDataFileInput from "@/components/FormDataFileInput"
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
          <div className="hidden md:flex gap-2 items-center p-2 text-caption text-color-muted">
            <div className="w-5 shrink-0" />
            <div className="min-w-0 flex-1">Key</div>
            <div className="w-20 shrink-0">Type</div>
            <div className="min-w-0 flex-1">Value</div>
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
                  aria-label="Enable form data field"
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
                  aria-label="Form data key"
                  placeholder={
                    field.type === "file" ? "avatar or attachment" : "Key"
                  }
                  value={field.key}
                  onChange={(event) =>
                    updateField(field.id, "key", event.target.value)
                  }
                />
              </label>
              <div className="col-span-2 min-w-0 md:w-20 md:shrink-0">
                <span className="mb-1 block text-caption text-color-muted md:hidden">
                  Type
                </span>
                <Select
                  value={field.type}
                  onValueChange={(value: "text" | "file") =>
                    updateField(field.id, "type", value)
                  }
                >
                  <SelectTrigger
                    aria-label="Form data type"
                    className="w-full h-11 md:h-8"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 min-w-0 md:flex-1">
                <span className="mb-1 block text-caption text-color-muted md:hidden">
                  {field.type === "file" ? "Files" : "Value"}
                </span>
                {field.type === "text" ? (
                  <Input
                    className="h-11 md:h-8"
                    aria-label="Form data value"
                    placeholder="Value"
                    value={field.value}
                    onChange={(event) =>
                      updateField(field.id, "value", event.target.value)
                    }
                  />
                ) : (
                  <FormDataFileInput
                    files={field.files}
                    onChange={(files) => updateField(field.id, "files", files)}
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="col-start-2 row-start-1 justify-self-end h-11 w-11 md:h-8 md:w-8 shrink-0"
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
