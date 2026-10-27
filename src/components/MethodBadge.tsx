import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import { methods } from "@/constants/request"
import { cn } from "@/lib/utils"

type MethodBadgeProps = Omit<
  ComponentProps<typeof Badge>,
  "children" | "asChild"
> & {
  method: string
}

export default function MethodBadge({
  method,
  className,
  variant = "outline",
  ...props
}: MethodBadgeProps) {
  const label = method.trim().toUpperCase()
  const methodStyle = methods.find(({ value }) => value === label)

  return (
    <Badge
      {...props}
      variant={variant}
      className={cn(
        "font-mono p-3 rounded-md",
        methodStyle?.className,
        className,
      )}
    >
      {label}
    </Badge>
  )
}
