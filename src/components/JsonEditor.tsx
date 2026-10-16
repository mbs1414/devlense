import { json } from "@codemirror/lang-json"
import { tags } from "@lezer/highlight"
import { createTheme } from "@uiw/codemirror-themes"
import CodeMirror from "@uiw/react-codemirror"
import { Copy, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

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

interface Props {
  readOnly: boolean
}

export default function JsonEditor({ readOnly = false }: Props) {
  const [value, setValue] = useState(`{
  "name": "DevLens",
  "version": "1.0.0",
  "features": [
    "JSON Editor",
    "API Testing"
  ]
}`)

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface-subtle font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2">
        <div className="flex gap-3">
          <div className="text-color-code">JSON</div>
          <div className="text-color-muted">
            {readOnly ? "Read-only" : "Edit"}
          </div>
        </div>

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
        readOnly={readOnly}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
        }}
      />

      {/* loading */}
      {/* <div className="flex items-center justify-center bg-code">
        <span className="animate-pulse text-sm text-code-punctuation h-32">
          Sending request...
        </span>
      </div> */}
    </div>
  )
}
