import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import PlaceholderState from "@/components/PlaceholderState"

interface Props {
  title: string
  addButtonLabel: string
  fields: RequestField[]
  addField: () => void
  removeField: (paramId: string) => void
  updateField: <K extends keyof Omit<RequestField, "id">>(
    id: string,
    field: K,
    value: RequestField[K],
  ) => void
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
          <>
            <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-1 text-caption text-color-muted">
              <div>Enabled</div>
              <div>Key</div>
              <div>Value</div>
              <div>Description</div>
              <div />
            </div>

            {fields.map((field) => (
              <div
                className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md"
                key={field.id}
              >
                <Checkbox
                  checked={field.enabled}
                  onCheckedChange={(checked) =>
                    updateField(field.id, "enabled", checked === true)
                  }
                />

                <Input
                  placeholder="page"
                  value={field.key}
                  onChange={(e) => updateField(field.id, "key", e.target.value)}
                />

                <Input
                  placeholder="1"
                  value={field.value}
                  onChange={(e) =>
                    updateField(field.id, "value", e.target.value)
                  }
                />

                <Input
                  placeholder="Pagination page"
                  value={field.description}
                  onChange={(e) =>
                    updateField(field.id, "description", e.target.value)
                  }
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default RequestFieldsCard
