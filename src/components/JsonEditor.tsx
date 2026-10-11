import { json } from "@codemirror/lang-json"
import CodeMirror from "@uiw/react-codemirror"
import { Copy, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export default function JsonEditor() {
  const [value, setValue] = useState(`{
  "name": "DevLens",
  "version": "1.0.0",
  "features": [
    "JSON Editor",
    "API Testing"
  ]
}`)

  const [isEditing, setIsEditing] = useState(false)

  function formatJson() {
    try {
      setValue(JSON.stringify(JSON.parse(value), null, 2))
    } catch {
      // Keep the current value if the JSON is invalid.
    }
  }

  async function copyJson() {
    await navigator.clipboard.writeText(value)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            JSON
          </Button>

          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={formatJson}>
            Format
          </Button>

          <Button variant="ghost" size="icon" onClick={copyJson}>
            <Copy />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setValue("")}>
            <Trash2 />
          </Button>
        </div>
      </div>

      <CodeMirror
        value={value}
        extensions={[json()]}
        theme="dark"
        height="256px"
        className="h-64"
        onChange={(newValue) => setValue(newValue)}
        readOnly={!isEditing}
        editable={isEditing}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
        }}
      />
    </div>
  )
}
