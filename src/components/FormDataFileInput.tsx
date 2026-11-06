import { FolderOpen } from "lucide-react"
import { useId, useRef } from "react"

import { Button } from "@/components/ui/button"

interface Props {
  files: File[]
  onChange: (files: File[]) => void
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function FormDataFileInput({ files, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const helpId = useId()

  return (
    <div className="space-y-3 rounded-lg border border-border bg-input p-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        aria-label="Form data files"
        onChange={(event) => {
          const selectedFiles = Array.from(event.target.files ?? [])
          event.target.value = ""
          if (selectedFiles.length > 0) onChange(selectedFiles)
        }}
      />
      <Button
        type="button"
        variant="secondary"
        className="h-11 w-full md:w-auto"
        aria-describedby={helpId}
        onClick={() => inputRef.current?.click()}
      >
        <FolderOpen className="size-4" />
        {files.length ? "Change files" : "Choose files"}
      </Button>
      <p id={helpId} className="text-caption text-color-muted">
        Select files to include when you send this request.
      </p>
      <ul aria-label="Selected files" aria-live="polite" className="space-y-2">
        {files.map((file, index) => (
          <li key={index} className="text-caption">
            <span className="block break-all text-color-primary">
              {file.name}
            </span>
            <span className="text-color-muted">
              {formatFileSize(file.size)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
