import { json } from "@codemirror/lang-json"
import { tags } from "@lezer/highlight"
import { createTheme } from "@uiw/codemirror-themes"
import CodeMirror from "@uiw/react-codemirror"
import { Copy, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const editorTheme = createTheme({
  theme: "dark",
  settings: {
    background: "var(--code)",
    foreground: "var(--text-color-code)",
    caret: "var(--text-color-code)",
    selection: "var(--code-selection)",
    selectionMatch: "var(--code-selection)",
    lineHighlight: "var(--code-line-highlight)",
    gutterBackground: "var(--code)",
    gutterForeground: "var(--text-color-muted)",
    gutterActiveForeground: "var(--text-color-code)",
    gutterBorder: "transparent",
    fontFamily: "var(--font-mono)",
  },
  styles: [
    { tag: tags.propertyName, color: "var(--code-key)" },
    { tag: tags.string, color: "var(--code-string)" },
    { tag: tags.number, color: "var(--code-number)" },
    { tag: tags.bool, color: "var(--code-boolean)" },
    { tag: tags.null, color: "var(--code-null)" },
    { tag: tags.punctuation, color: "var(--code-punctuation)" },
  ],
})

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
      <div className="flex flex-wrap items-center justify-between gap-2 p-2">
        <ToggleGroup
          type="single"
          size="sm"
          spacing={1}
          value={isEditing ? "edit" : "json"}
          onValueChange={(mode) => {
            if (mode) setIsEditing(mode === "edit")
          }}
          aria-label="Editor mode"
        >
          <ToggleGroupItem
            value="json"
            className="data-[state=on]:bg-active data-[state=on]:text-color-primary"
          >
            JSON
          </ToggleGroupItem>
          <ToggleGroupItem
            value="edit"
            aria-label="Edit JSON"
            className="data-[state=on]:bg-active data-[state=on]:text-color-primary"
          >
            Edit
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={formatJson}>
            Format
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={copyJson}
            aria-label="Copy JSON"
            title="Copy JSON"
          >
            <Copy />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setValue("")}
            aria-label="Clear JSON"
            title="Clear JSON"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <CodeMirror
        value={value}
        extensions={[json()]}
        theme={editorTheme}
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
