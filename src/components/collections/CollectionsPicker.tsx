import PlaceholderState from "@/components/PlaceholderState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { methods } from "@/constants/request"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, ChevronUp, Folder, Search, X } from "lucide-react"
import { Popover } from "radix-ui"
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"

export type SavedRequest = {
  id: string
  name: string
  method: string
}

export type SavedCollection = {
  id: string
  name: string
  requests: SavedRequest[]
}

type CollectionsPickerProps = {
  collections?: SavedCollection[]
  recentRequestIds?: string[]
  activeRequestId?: string
  onRequestSelect?: (request: SavedRequest, collection: SavedCollection) => void
}

type RequestRowProps = {
  request: SavedRequest
  collectionName?: string
  active: boolean
  onSelect: () => void
}

function RequestRow({
  request,
  collectionName,
  active,
  onSelect,
}: RequestRowProps) {
  const method = request.method.toUpperCase()
  const methodColor = methods.find((item) => item.value === method)?.className

  return (
    <button
      type="button"
      data-picker-item
      aria-current={active ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "flex min-h-11 w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset",
        active && "bg-action-primary/15 hover:bg-action-primary/20",
      )}
    >
      <span
        className={cn(
          "w-16 shrink-0 rounded-md bg-surface-subtle px-1 py-1 text-center font-mono text-code-small [overflow-wrap:anywhere]",
          methodColor ?? "text-color-muted",
        )}
      >
        {method}
      </span>
      <span className="min-w-0 flex-1 py-1">
        <span className="block text-body text-color-primary [overflow-wrap:anywhere]">
          {request.name}
        </span>
        {collectionName && (
          <span className="mt-1 block text-caption text-color-muted [overflow-wrap:anywhere]">
            {collectionName}
          </span>
        )}
      </span>
      {active && (
        <Check
          className="mt-1 size-4 shrink-0 text-color-accent"
          aria-hidden="true"
        />
      )}
    </button>
  )
}

export default function CollectionsPicker({
  collections = [],
  recentRequestIds = [],
  activeRequestId,
  onRequestSelect,
}: CollectionsPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const query = search.trim().toLowerCase()

  const visibleCollections = collections
    .map((collection) => ({
      collection,
      requests: collection.requests.filter((request) =>
        `${collection.name} ${request.method} ${request.name}`
          .toLowerCase()
          .includes(query),
      ),
    }))
    .filter(({ requests }) => !query || requests.length > 0)

  const allRequests = collections.flatMap((collection) =>
    collection.requests.map((request) => ({ request, collection })),
  )
  const recentRequests = recentRequestIds
    .map((id) => allRequests.find(({ request }) => request.id === id))
    .filter((item) => item !== undefined)
    .filter(({ request, collection }) =>
      `${collection.name} ${request.method} ${request.name}`
        .toLowerCase()
        .includes(query),
    )

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault()
        setOpen((previous) => !previous)
        setSearch("")
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setSearch("")
  }

  function handleRequestSelect(
    request: SavedRequest,
    collection: SavedCollection,
  ) {
    onRequestSelect?.(request, collection)
    handleOpenChange(false)
  }

  function handleArrowKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-picker-item]"),
    ).filter((item) => item.getClientRects().length > 0)
    if (items.length === 0) return

    const currentIndex = items.indexOf(document.activeElement as HTMLElement)
    const movingDown = event.key === "ArrowDown"
    const nextIndex =
      currentIndex === -1
        ? movingDown
          ? 0
          : items.length - 1
        : (currentIndex + (movingDown ? 1 : -1) + items.length) % items.length

    event.preventDefault()
    items[nextIndex].focus()
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button
          aria-keyshortcuts="Control+k Meta+k"
          className="fixed right-4 bottom-4 z-40 h-11 gap-2 rounded-full px-5 shadow-lg md:right-6 md:bottom-6"
        >
          <Folder className="size-5" aria-hidden="true" />
          Collections
          <ChevronUp
            className={cn(
              "size-4 transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="end"
          sideOffset={12}
          collisionPadding={16}
          aria-labelledby={titleId}
          onKeyDown={handleArrowKeys}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            searchInputRef.current?.focus()
          }}
          className="z-50 flex max-h-[min(36rem,var(--radix-popover-content-available-height))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-surface text-color-primary shadow-2xl outline-none sm:w-104"
        >
          <div className="flex shrink-0 items-center justify-between px-4 pt-4">
            <h2
              id={titleId}
              className="flex items-center gap-2 text-section-title font-semibold"
            >
              <Folder className="size-5" aria-hidden="true" />
              Collections
            </h2>
            <Popover.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close collections"
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </Popover.Close>
          </div>

          <div className="relative m-4 shrink-0">
            <Search
              className="pointer-events-none absolute top-3 left-3 size-4 text-color-muted"
              aria-hidden="true"
            />
            <Input
              ref={searchInputRef}
              type="search"
              aria-label="Search saved requests"
              placeholder="Search saved requests…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 pl-9"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
            {recentRequests.length > 0 && (
              <section
                className="mb-3 border-b border-border-subtle pb-3"
                aria-label="Recent requests"
              >
                <h3 className="px-3 py-2 text-caption font-medium uppercase tracking-wide text-color-muted">
                  Recent
                </h3>
                {recentRequests.map(({ request, collection }) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    collectionName={collection.name}
                    active={request.id === activeRequestId}
                    onSelect={() => handleRequestSelect(request, collection)}
                  />
                ))}
              </section>
            )}

            {visibleCollections.map(({ collection, requests }, index) => (
              <details
                key={`${collection.id}-${query ? "search" : "all"}`}
                open={!!query || index === 0}
                className="border-b border-border-subtle last:border-0 [&[open]>summary>svg:first-child]:rotate-90"
              >
                <summary
                  data-picker-item
                  className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-body font-medium outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset [&::-webkit-details-marker]:hidden"
                >
                  <ChevronRight
                    className="size-3.5 shrink-0 transition-transform motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  <Folder
                    className="size-4 shrink-0 text-color-muted"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    {collection.name}
                  </span>
                  <span className="shrink-0 text-caption font-normal text-color-muted">
                    {requests.length}
                  </span>
                </summary>
                <div className="pb-2">
                  {requests.map((request) => (
                    <RequestRow
                      key={request.id}
                      request={request}
                      active={request.id === activeRequestId}
                      onSelect={() => handleRequestSelect(request, collection)}
                    />
                  ))}
                  {requests.length === 0 && (
                    <p className="px-3 py-3 text-caption text-color-muted">
                      No requests in this collection.
                    </p>
                  )}
                </div>
              </details>
            ))}

            {visibleCollections.length === 0 && (
              <div className="text-center [&>div]:border-0 [&>div]:px-4 [&>div]:py-6">
                <PlaceholderState
                  variant="inline"
                  icon={query ? Search : Folder}
                  title={query ? "No matching requests" : "No collections yet"}
                  description={
                    query
                      ? "Try another collection or request name."
                      : "Your saved requests will appear here."
                  }
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border-subtle px-4 py-3 text-caption text-color-muted">
            <span>↑ ↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
