import { Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"

interface Props {
  addButtonLabel: string
}

const RequestFieldsCard = ({ addButtonLabel }: Props) => {
  return (
    <Card className="bg-surface my-4">
      <CardHeader>
        <CardTitle className="text-section-title font-semibold">
          Params
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-[64px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 text-caption text-color-muted">
          <div>Enabled</div>
          <div>Key</div>
          <div>Value</div>
          <div>Description</div>
          <div />
        </div>

        <div className="grid grid-cols-[20px_repeat(3,minmax(0,1fr))_32px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md">
          <Checkbox />

          <Input placeholder="page" />

          <Input placeholder="1" />

          <Input placeholder="Pagination page" />

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="secondary" size="lg">
          <Plus className="h-4 w-4" />
          {addButtonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

export default RequestFieldsCard
