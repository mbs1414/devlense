import CodeMirror, {
  Decoration,
  EditorState,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  keymap,
  type DecorationSet,
  type ViewUpdate,
} from "@uiw/react-codemirror"
import { useMemo, useState, type MouseEvent } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { resolveVariables } from "@/lib/resolveVariables"

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "var(--text-color-primary)",
    fontSize: "14px",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "22px",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
  },
  ".cm-scroller::-webkit-scrollbar": { display: "none" },
  ".cm-content": { padding: "10px 0", caretColor: "var(--text-color-primary)" },
  ".cm-line": { padding: "0 10px" },
  ".cm-placeholder": { color: "var(--text-color-muted)" },
  ".cm-cursor": { borderLeftColor: "var(--text-color-primary)" },
})

interface Props {
  value: string
  onChange: (value: string) => void
  variables: EnvironmentVariable[]
}

export default function RequestUrlInput({ value, onChange, variables }: Props) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [hoveredVariable, setHoveredVariable] = useState<{
    text: string
    left: number
    top: number
    width: number
    height: number
    value: string
    variables: EnvironmentVariable[]
  } | null>(null)
  const tooltip = hoveredVariable
  const showTooltip =
    isTooltipOpen && tooltip?.value === value && tooltip.variables === variables

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-variable-tooltip]")
        : null
    const text = target?.dataset.variableTooltip
    if (!target || !text) {
      setIsTooltipOpen(false)
      return
    }

    const bounds = target.getBoundingClientRect()
    const container = event.currentTarget.getBoundingClientRect()
    const left = bounds.left - container.left
    setIsTooltipOpen(true)
    if (
      tooltip?.text === text &&
      tooltip.left === left &&
      tooltip.value === value &&
      tooltip.variables === variables
    )
      return

    setHoveredVariable({
      text,
      left,
      top: bounds.top - container.top,
      width: bounds.width,
      height: bounds.height,
      value,
      variables,
    })
  }

  const extensions = useMemo(() => {
    const matcher = new MatchDecorator({
      regexp: /{{\s*([^{}]+?)\s*}}/g,
      decoration: (match) => {
        const name = match[1].trim()
        const variable = variables.findLast(
          (variable) => variable.enabled && variable.key.trim() === name,
        )

        try {
          const resolved = resolveVariables(match[0], variables)
          return Decoration.mark({
            class: "text-color-accent bg-code-selection rounded-sm",
            attributes: {
              "data-variable-tooltip": `${name}: ${variable?.type === "secret" ? "•••••• (secret)" : resolved}`,
            },
          })
        } catch (error) {
          return Decoration.mark({
            class: "text-status-error-fg underline decoration-dotted",
            attributes: {
              "data-variable-tooltip":
                error instanceof Error
                  ? error.message
                  : "Variable is unavailable",
            },
          })
        }
      },
    })

    const highlights = ViewPlugin.fromClass(
      class {
        decorations: DecorationSet
        constructor(view: EditorView) {
          this.decorations = matcher.createDeco(view)
        }
        update(update: ViewUpdate) {
          this.decorations = matcher.updateDeco(update, this.decorations)
        }
      },
      { decorations: (plugin) => plugin.decorations },
    )

    return [
      highlights,
      EditorView.contentAttributes.of({
        "aria-label": "Request URL",
        "aria-multiline": "false",
        spellcheck: "false",
      }),
      EditorState.allowMultipleSelections.of(false),
      keymap.of([{ key: "Enter", run: () => true }]),
      EditorState.transactionFilter.of((transaction) => {
        if (transaction.newDoc.lines === 1) return transaction
        const text = transaction.newDoc.toString().replace(/[\r\n]/g, "")
        return {
          changes: {
            from: 0,
            to: transaction.startState.doc.length,
            insert: text,
          },
          selection: {
            anchor: Math.min(transaction.newSelection.main.head, text.length),
          },
        }
      }),
    ]
  }, [variables])

  return (
    <div
      className="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-input transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsTooltipOpen(false)}
      onScrollCapture={() => setIsTooltipOpen(false)}
      onKeyDownCapture={() => setIsTooltipOpen(false)}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={editorTheme}
        placeholder="{{baseUrl}}/users"
        height="42px"
        width="100%"
        className="min-w-0"
        indentWithTab={false}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          highlightSelectionMatches: false,
          autocompletion: false,
          bracketMatching: false,
          closeBrackets: false,
          drawSelection: false,
        }}
      />
      <Tooltip open={Boolean(showTooltip)} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: tooltip?.left ?? 0,
              top: tooltip?.top ?? 0,
              width: tooltip?.width ?? 0,
              height: tooltip?.height ?? 0,
            }}
          />
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          className="break-all"
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseMove={(event) => event.stopPropagation()}
          onMouseLeave={() => setIsTooltipOpen(false)}
        >
          {tooltip?.text}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
