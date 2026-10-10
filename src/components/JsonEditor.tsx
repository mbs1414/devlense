import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"

import { useState } from "react"

export default function JsonEditor() {
  const [value, setValue] = useState(`{
  "name": "DevLens",
  "version": "1.0.0",
  "features": [
    "JSON Editor",
    "API Testing"
  ]
}`)

  return (
    <CodeMirror
      value={value}
      height="300px"
      extensions={[json()]}
      theme="dark"
      onChange={(value) => setValue(value)}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
      }}
      className="overflow-hidden rounded-md border border-zinc-800"
    />
  )
}
