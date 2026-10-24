import { countRequests, isNamedItem } from "@/lib/collections"
import { cn } from "@/lib/utils"
import { ChevronRight, Folder } from "lucide-react"
import type { ReactNode } from "react"

const methodColors = new Map([
  ["GET", "text-method-get-fg"],
  ["POST", "text-method-post-fg"],
  ["PUT", "text-method-put-fg"],
  ["PATCH", "text-method-patch-fg"],
  ["DELETE", "text-method-delete-fg"],
])

function CollectionGroup({
  name,
  initiallyOpen = false,
  collection = false,
  requestCount,
  children,
}: {
  name: string
  initiallyOpen?: boolean
  collection?: boolean
  requestCount?: number
  children: ReactNode
}) {
  return (
    <details
      open={initiallyOpen}
      className={cn(
        "min-w-0 [&[open]>summary>svg]:rotate-90",
        collection && "rounded-xl border border-border-subtle bg-surface",
      )}
    >
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-lg p-2 text-body-medium font-medium text-color-primary outline-none transition-colors hover:bg-hover focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas [&::-webkit-details-marker]:hidden",
          collection && "rounded-xl p-4 md:p-5",
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center text-color-muted",
            collection &&
              "size-10 rounded-xl bg-action-primary/10 text-color-accent",
          )}
        >
          <Folder
            className={collection ? "size-5" : "size-4"}
            aria-hidden="true"
          />
        </span>
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
          <span className="block">{name}</span>
          {requestCount !== undefined && (
            <span className="mt-1 block text-caption font-normal text-color-muted">
              {requestCount} {requestCount === 1 ? "request" : "requests"}
            </span>
          )}
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-color-muted transition-transform motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div
        className={
          collection
            ? "border-t border-border-subtle p-3 md:p-4"
            : "ml-4 border-l border-border-subtle pl-3"
        }
      >
        {children}
      </div>
    </details>
  )
}

function CollectionItems({
  items,
  searching = false,
}: {
  items: unknown[]
  searching?: boolean
}) {
  return (
    <ul className="min-w-0 space-y-1">
      {items.map((item, index) => {
        if (!isNamedItem(item)) return null

        if ("item" in item && Array.isArray(item.item)) {
          return (
            <li key={index}>
              <CollectionGroup name={item.name} initiallyOpen={searching}>
                <CollectionItems items={item.item} searching={searching} />
              </CollectionGroup>
            </li>
          )
        }

        if (!("request" in item)) return null

        const request = item.request
        const method =
          typeof request === "object" &&
          request !== null &&
          "method" in request &&
          typeof request.method === "string"
            ? request.method.toUpperCase()
            : "Request"

        return (
          <li
            key={index}
            className="grid min-h-11 grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-3 rounded-lg px-2 py-2.5 text-label transition-colors hover:bg-hover"
          >
            <span
              className={cn(
                "rounded-md bg-surface-subtle px-1.5 py-0.5 text-center font-mono text-code-small [overflow-wrap:anywhere]",
                methodColors.get(method) ?? "text-color-muted",
              )}
            >
              {method}
            </span>
            <span className="min-w-0 py-0.5 text-color-secondary [overflow-wrap:anywhere]">
              {item.name}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function CollectionList({
  collections,
  searching,
}: {
  collections: {
    id: string
    data: { info: { name: string } }
    items: unknown[]
  }[]
  searching: boolean
}) {
  return (
    <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
      {collections.map(({ id, data, items }) => (
        <CollectionGroup
          key={`${id}-${searching ? "search" : "browse"}`}
          name={data.info.name}
          initiallyOpen
          collection
          requestCount={countRequests(items)}
        >
          {items.length > 0 ? (
            <CollectionItems items={items} searching={searching} />
          ) : (
            <p className="px-2 py-3 text-caption text-color-muted">
              This collection has no requests yet.
            </p>
          )}
        </CollectionGroup>
      ))}
    </div>
  )
}
