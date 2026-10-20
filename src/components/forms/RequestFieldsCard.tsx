import { Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import type { QueryParam } from "@/routes/request"

interface Props {
  addButtonLabel: string
  params: QueryParam[]
  addParam: () => void
  removeParam: (paramId: string) => void
  updateParam: <K extends keyof Omit<QueryParam, "id">>(
    id: string,
    field: K,
    value: QueryParam[K],
  ) => void
}

const RequestFieldsCard = ({
  addButtonLabel,
  params,
  addParam,
  removeParam,
  updateParam,
}: Props) => {
  return (
    <Card className="bg-surface mt-4">
      <CardHeader>
        <CardTitle className="text-section-title font-semibold">
          Params
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-1 text-caption text-color-muted">
          <div>Enabled</div>
          <div>Key</div>
          <div>Value</div>
          <div>Description</div>
          <div />
        </div>

        {params.map((param) => (
          <div
            className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md"
            key={param.id}
          >
            <Checkbox
              checked={param.enabled}
              onCheckedChange={(checked) =>
                updateParam(param.id, "enabled", checked === true)
              }
            />

            <Input
              placeholder="page"
              value={param.key}
              onChange={(e) => updateParam(param.id, "key", e.target.value)}
            />

            <Input
              placeholder="1"
              value={param.value}
              onChange={(e) => updateParam(param.id, "value", e.target.value)}
            />

            <Input
              placeholder="Pagination page"
              value={param.description}
              onChange={(e) =>
                updateParam(param.id, "description", e.target.value)
              }
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeParam(param.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}

        <Button variant="secondary" size="lg" onClick={addParam}>
          <Plus className="size-4" />
          {addButtonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

export default RequestFieldsCard
