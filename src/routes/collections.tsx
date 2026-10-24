import PlaceholderState from "@/components/PlaceholderState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CollectionList from "@/components/collections/CollectionList"
import {
  filterItems,
  isPostmanCollection,
  type ImportedCollection,
} from "@/lib/collections"
import { createFileRoute } from "@tanstack/react-router"
import { Layers3, Plus, Search, X } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const [collections, setCollections] = useState<ImportedCollection[]>([])
    const [search, setSearch] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const query = search.trim().toLowerCase()
    const visibleCollections = collections.flatMap(({ id, data }) => {
      const matchesCollection = data.info.name.toLowerCase().includes(query)
      const items =
        !query || matchesCollection ? data.item : filterItems(data.item, query)
      return !query || matchesCollection || items.length > 0
        ? [{ id, data, items }]
        : []
    })

    const handleImport = async (file: File) => {
      try {
        const text = await file.text()
        const data: unknown = JSON.parse(text)

        if (!isPostmanCollection(data)) {
          throw new Error(
            "The file does not have a Postman collection structure",
          )
        }

        setCollections((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            data,
          },
        ])
      } catch (error) {
        console.error("Failed to import collection:", error)
      }
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0]
      event.currentTarget.value = ""

      if (file) {
        await handleImport(file)
      }
    }

    return (
      <section
        aria-labelledby="collections-title"
        className="mx-auto flex min-h-[calc(100svh-5.25rem)] w-full max-w-7xl min-w-0 flex-col gap-6 md:min-h-[calc(100svh-3rem)] md:gap-8"
      >
        <header className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 md:gap-y-4">
          <h1
            id="collections-title"
            className="text-page-title font-semibold text-color-primary md:col-span-2"
          >
            Collections
          </h1>
          <p className="hidden text-body text-color-secondary md:block">
            Saved requests are grouped by purpose, not placed in the global
            sidebar.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            aria-label="Import a Postman collection"
            hidden
            onChange={handleFileChange}
          />
          <Button
            aria-label="Import Collection"
            className="h-9 gap-1.5 px-3 text-label"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="sm:hidden">Import</span>
            <span className="hidden sm:inline">Import Collection</span>
          </Button>
        </header>

        <div className="min-w-0 flex-1">
          {collections.length === 0 ? (
            <div className="rounded-xl bg-surface text-center [&>div]:min-h-80 [&>div]:px-5 [&>div]:py-8">
              <PlaceholderState
                variant="inline"
                icon={Layers3}
                title="No collections yet"
                description="Import a Postman collection to organize your requests."
              />
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-section-title font-semibold text-color-primary">
                  Your collections
                </h2>
                <div className="relative w-full sm:max-w-80">
                  <Search
                    className="pointer-events-none absolute top-3 left-3 size-4 text-color-muted"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    aria-label="Search collections or requests"
                    placeholder="Search collections or requests…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 bg-surface pr-10 pl-9 [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-1.5 right-1.5"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="sr-only" role="status">
                {visibleCollections.length} matching{" "}
                {visibleCollections.length === 1 ? "collection" : "collections"}
              </p>
              {visibleCollections.length === 0 ? (
                <div className="text-center [&>div]:min-h-64 [&>div]:px-5">
                  <PlaceholderState
                    variant="inline"
                    icon={Search}
                    title="No matching collections"
                    description="Try another collection or request name."
                  />
                </div>
              ) : (
                <CollectionList
                  collections={visibleCollections}
                  searching={!!query}
                />
              )}
            </>
          )}
        </div>
      </section>
    )
  },
})
