import { FileMinus2, Info } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"

interface Props {
  title: string
  description: string
  variant?: "panel" | "inline"
  icon?: LucideIcon
}

const PlaceholderState = ({
  title,
  description,
  variant,
  icon: Icon = FileMinus2,
}: Props) => {
  if (variant === "panel") {
    return (
      <Card className="bg-surface flex-1">
        <CardContent className="h-full flex flex-col gap-4 rounded-lg justify-center items-center mx-4 border border-border-subtle min-h-44">
          <Info className="size-12 text-color-muted" aria-hidden="true" />
          <p className="text-body font-semibold text-color-primary">{title}</p>
          <p className="text-caption text-color-secondary">{description}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4 rounded-lg justify-center items-center border border-border-subtle min-h-44">
      <Icon className="size-12 text-color-muted" aria-hidden="true" />
      <p className="text-body font-semibold text-color-primary">{title}</p>
      <p className="text-caption text-color-secondary">{description}</p>
    </div>
  )
}

export default PlaceholderState
