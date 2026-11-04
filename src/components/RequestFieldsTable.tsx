import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type RequestField = {
  key: string
  value: string
  description?: string
  children?: RequestField[]
}

type RequestFieldsTableProps = {
  fields?: RequestField[]
  body?: RequestField[]
}

export function RequestFieldsTable({
  fields = [],
  body,
}: RequestFieldsTableProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const rows = body ?? fields

  const toggleRow = (path: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const renderRows = (
    items: RequestField[],
    depth = 0,
    parentPath = "",
  ): React.ReactNode[] => {
    return items.flatMap((field, index) => {
      const path = `${parentPath}/${index}`
      const hasChildren = Boolean(field.children?.length)
      const isExpanded = !collapsed[path]

      const row = (
        <TableRow key={path} className="border-0 hover:bg-transparent">
          <TableCell className="h-12 overflow-hidden px-3 text-color-primary">
            <div
              className="flex min-w-0 items-center gap-1"
              style={{ paddingLeft: depth * 16 }}
            >
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggleRow(path)}
                  aria-expanded={isExpanded}
                  aria-label={`Toggle ${field.key}`}
                  className="flex size-5 shrink-0 items-center justify-center"
                >
                  {isExpanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </button>
              )}

              <span className="truncate">{field.key}</span>
            </div>
          </TableCell>

          <TableCell className="overflow-hidden px-3 font-mono text-(length:--text-code) text-color-secondary">
            <span className="block truncate">{field.value}</span>
          </TableCell>

          <TableCell className="overflow-hidden px-3 text-color-secondary">
            <span className="block truncate">{field.description}</span>
          </TableCell>
        </TableRow>
      )

      if (hasChildren && isExpanded) {
        return [row, ...renderRows(field.children!, depth + 1, path)]
      }

      return [row]
    })
  }

  return (
    <Table className="table-fixed border-separate border-spacing-0 text-label">
      <TableHeader>
        <TableRow className="border-0 hover:bg-transparent">
          <TableHead className="h-8 w-[35%] truncate px-3 text-(length:--text-caption) text-color-muted">
            Key
          </TableHead>
          <TableHead className="h-8 w-[35%] truncate px-3 text-(length:--text-caption) text-color-muted">
            Value
          </TableHead>
          <TableHead className="h-8 truncate px-3 text-(length:--text-caption) text-color-muted">
            Description
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody
        className="
          [&_tr>*]:border-b
          [&_tr>*]:border-border-subtle
          [&_tr>*:first-child]:border-l
          [&_tr>*:last-child]:border-r
          [&_tr:first-child>*]:border-t
          [&_tr:first-child>*:first-child]:rounded-tl-lg
          [&_tr:first-child>*:last-child]:rounded-tr-lg
          [&_tr:last-child>*:first-child]:rounded-bl-lg
          [&_tr:last-child>*:last-child]:rounded-br-lg
        "
      >
        {renderRows(rows)}
      </TableBody>
    </Table>
  )
}
