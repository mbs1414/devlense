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
        <TableRow
          key={path}
          className="block rounded-lg border border-border-subtle p-3 md:table-row md:rounded-none md:border-0 md:p-0 hover:bg-transparent"
        >
          <TableCell className="block whitespace-normal p-0 text-color-primary md:table-cell md:h-12 md:overflow-hidden md:px-3">
            <span className="mb-1 block text-caption text-color-muted md:hidden">
              Key
            </span>
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
                  className="flex size-11 md:size-5 shrink-0 items-center justify-center"
                >
                  {isExpanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </button>
              )}

              <span className="min-w-0 break-all md:truncate">{field.key}</span>
            </div>
          </TableCell>

          <TableCell className="block whitespace-normal px-0 pt-3 font-mono text-(length:--text-code) text-color-secondary md:table-cell md:overflow-hidden md:px-3 md:py-2">
            <span className="mb-1 block font-sans text-caption text-color-muted md:hidden">
              Value
            </span>
            <span className="block whitespace-pre-wrap break-all md:truncate md:whitespace-nowrap">
              {field.value}
            </span>
          </TableCell>

          <TableCell className="block whitespace-normal px-0 pt-3 text-color-secondary md:table-cell md:overflow-hidden md:px-3 md:py-2">
            <span className="mb-1 block text-caption text-color-muted md:hidden">
              Description
            </span>
            <span className="block whitespace-pre-wrap break-all md:truncate md:whitespace-nowrap">
              {field.description || "—"}
            </span>
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
    <Table className="block md:table table-fixed border-separate border-spacing-0 text-label">
      <TableHeader className="hidden md:table-header-group">
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
          block space-y-3 md:table-row-group md:space-y-0
          md:[&_tr>*]:border-b
          md:[&_tr>*]:border-border-subtle
          md:[&_tr>*:first-child]:border-l
          md:[&_tr>*:last-child]:border-r
          md:[&_tr:first-child>*]:border-t
          md:[&_tr:first-child>*:first-child]:rounded-tl-lg
          md:[&_tr:first-child>*:last-child]:rounded-tr-lg
          md:[&_tr:last-child>*:first-child]:rounded-bl-lg
          md:[&_tr:last-child>*:last-child]:rounded-br-lg
        "
      >
        {renderRows(rows)}
      </TableBody>
    </Table>
  )
}
