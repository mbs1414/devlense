import { useRef, useState, type DragEvent, type ReactNode } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
  className?: string
  onImport: (files: File[]) => Promise<void>
  disabled?: boolean
}

export default function CollectionImportDropZone({
  children,
  className,
  onImport,
  disabled = false,
}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const dragDepth = useRef(0)

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    dragDepth.current += 1
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    event.dataTransfer.dropEffect = disabled ? "none" : "copy"
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return
    event.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    if (disabled) return

    await onImport(Array.from(event.dataTransfer.files))
  }

  return (
    <div
      className={cn("relative", className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && !disabled && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-action-primary bg-surface/95">
          <Upload className="size-10 text-color-accent" />
          <p className="text-section-title text-color-primary">
            Drop Postman collections here
          </p>
          <p className="text-caption text-color-secondary">
            You can drop multiple JSON files at once.
          </p>
        </div>
      )}
    </div>
  )
}
