import { FileMinus2, Info } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { cn } from "@/lib/utils"

interface Props {
  title: string
  description: string
  variant?: "panel" | "inline"
  icon?: LucideIcon
  showBorder?: boolean
}

const PlaceholderState = ({
  title,
  description,
  variant,
  icon: Icon = FileMinus2,
  showBorder = true,
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
    <div
      className={cn(
        "h-full flex flex-col gap-4 rounded-lg justify-center items-center min-h-44",
        showBorder && "border border-border-subtle",
      )}
    >
      <Icon className="size-12 text-color-muted" aria-hidden="true" />
      <p className="text-body font-semibold text-color-primary">{title}</p>
      <p className="text-caption text-color-secondary">{description}</p>
    </div>
  )
}

export default PlaceholderState
