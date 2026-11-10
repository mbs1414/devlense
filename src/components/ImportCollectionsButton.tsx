import { useRef } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  onImport: (files: File[]) => Promise<void>
  isImporting: boolean
  disabled?: boolean
  compact?: boolean
}

export default function ImportCollectionsButton({
  onImport,
  isImporting,
  disabled = false,
  compact = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        type="file"
        accept=".json,application/json"
        multiple
        ref={fileInputRef}
        hidden
        onChange={async (event) => {
          const files = Array.from(event.target.files ?? [])
          event.currentTarget.value = ""
          if (files.length > 0) await onImport(files)
        }}
      />
      <Button
        className={compact ? "h-8" : undefined}
        aria-label="Import collections"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isImporting}
      >
        <Plus />
        <span>
          {isImporting ? "Importing..." : compact ? "Import" : "Import Collections"}
        </span>
      </Button>
    </>
  )
}

export function CollectionImportFeedback({
  message,
  errors,
}: {
  message: string
  errors: string[]
}) {
  return (
    <>
      {message && (
        <p
          role="status"
          className="shrink-0 text-caption text-color-secondary mb-4"
        >
          {message}
        </p>
      )}
      {errors.length > 0 && (
        <ul
          role="alert"
          className="shrink-0 text-caption text-status-error-fg mb-4 space-y-1"
        >
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </>
  )
}
