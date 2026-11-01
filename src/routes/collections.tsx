import MethodBadge from "@/components/MethodBadge"
import PlaceholderState from "@/components/PlaceholderState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { createFileRoute } from "@tanstack/react-router"
import {
  ChevronRightIcon,
  FolderIcon,
  FolderPlus,
  Plus,
  Search,
  SearchX,
} from "lucide-react"
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  type ChangeEvent,
  type ReactNode,
} from "react"

const DB_NAME = "postman-collections-db"
const DB_VERSION = 1
const STORE_NAME = "collections"

// 1. Open the IndexedDB database
function openCollectionsDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          autoIncrement: true,
        })
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// 2. Save a collection into IndexedDB
async function saveCollectionToIndexedDB(
  collection: PostmanCollection,
): Promise<void> {
  const db = await openCollectionsDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")

    transaction.objectStore(STORE_NAME).add(collection)

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error ?? new Error("Save failed"))
    }
  })
}

// 3. Load all previously saved collections
async function loadCollectionsFromIndexedDB(): Promise<PostmanCollection[]> {
  const db = await openCollectionsDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const request = transaction.objectStore(STORE_NAME).getAll()

    let collections: PostmanCollection[] = []

    request.onsuccess = () => {
      collections = request.result as PostmanCollection[]
    }

    transaction.oncomplete = () => {
      db.close()
      resolve(collections)
    }

    transaction.onabort = () => {
      db.close()
      reject(transaction.error ?? new Error("Load failed"))
    }
  })
}

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const [collections, setCollections] = useState<PostmanCollection[]>([])
    const [isLoadingCollections, setIsLoadingCollections] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const collectionFileInputRef = useRef<HTMLInputElement>(null)

    const requestCount = useMemo(() => {
      const countRequests = (items: PostmanItem[]): number =>
        items.reduce(
          (total, item) =>
            total +
            (item.request != null ? 1 : 0) +
            (item.item ? countRequests(item.item) : 0),
          0,
        )

      return collections.reduce(
        (total, collection) => total + countRequests(collection.item),
        0,
      )
    }, [collections])

    // Load saved collections when the component opens
    useEffect(() => {
      let cancelled = false

      const loadSavedCollections = async () => {
        try {
          const savedCollections = await loadCollectionsFromIndexedDB()

          if (!cancelled) {
            setCollections(savedCollections)
          }
        } catch (error) {
          console.error("Failed to load collections:", error)
        } finally {
          if (!cancelled) {
            setIsLoadingCollections(false)
          }
        }
      }

      void loadSavedCollections()

      return () => {
        cancelled = true
      }
    }, [])

    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedSearch(searchQuery)
      }, 300)

      return () => {
        clearTimeout(timeout)
      }
    }, [searchQuery])

    const openCollectionFilePicker = () => {
      collectionFileInputRef.current?.click()
    }

    const isPostmanCollection = (data: unknown): data is PostmanCollection => {
      if (typeof data !== "object" || data === null) return false

      if (!("info" in data) || !("item" in data)) return false

      const { info, item } = data

      if (typeof info !== "object" || info === null) return false

      return (
        "name" in info &&
        typeof info.name === "string" &&
        info.name.trim().length > 0 &&
        "schema" in info &&
        typeof info.schema === "string" &&
        Array.isArray(item)
      )
    }

    const handleCollectionFileChange = async (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0]

      event.currentTarget.value = ""

      if (!file) return

      try {
        // Step 1: Read the selected JSON file
        const text = await file.text()

        // Step 2: Convert JSON text into an object
        const collection: unknown = JSON.parse(text)

        // Step 3: Validate the Postman collection
        if (!isPostmanCollection(collection)) {
          console.error("Please select a valid Postman collection.")
          return
        }

        // Step 4: Save the collection into IndexedDB
        await saveCollectionToIndexedDB(collection)

        // Step 5: Update React state to show the collection
        setCollections((previous) => [...previous, collection])

        console.log("Collection saved successfully!")
      } catch (error) {
        console.error("Failed to import collection:", error)
      }
    }

    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    const isSearching = normalizedSearch.length > 0

    const filteredCollections = useMemo(() => {
      // No search? Return the original collections.
      if (!normalizedSearch) {
        return collections
      }

      const filterItems = (items: PostmanItem[]): PostmanItem[] => {
        return items.reduce<PostmanItem[]>((result, currentItem) => {
          const nameMatches = (currentItem.name ?? "")
            .toLowerCase()
            .includes(normalizedSearch)

          if (nameMatches) {
            result.push(currentItem)
            return result
          }

          if (currentItem.item) {
            const matchingChildren = filterItems(currentItem.item)

            if (matchingChildren.length > 0) {
              result.push({
                ...currentItem,
                item: matchingChildren,
              })
            }
          }

          return result
        }, [])
      }

      return collections.reduce<PostmanCollection[]>((result, collection) => {
        const collectionMatches = collection.info.name
          .toLowerCase()
          .includes(normalizedSearch)

        if (collectionMatches) {
          result.push(collection)
          return result
        }

        const matchingItems = filterItems(collection.item)

        if (matchingItems.length > 0) {
          result.push({
            ...collection,
            item: matchingItems,
          })
        }

        return result
      }, [])
    }, [collections, normalizedSearch])

    const renderItems = useCallback(
      (items: PostmanItem[]): ReactNode => {
        return (
          <div className="flex flex-col gap-1">
            {items.map(({ name, item, request }, index) =>
              item ? (
                <Collapsible
                  key={`${index}-${isSearching}`}
                  defaultOpen={isSearching}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="collectionFolder"
                      size="sm"
                      className="group w-full justify-start gap-2 transition-none"
                    >
                      <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                      <FolderIcon />
                      <span className="truncate">{name}</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ml-5">
                    {renderItems(item)}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="collectionApi"
                  key={index}
                  className="w-full justify-start gap-2 text-foreground"
                >
                  {typeof request === "object" &&
                    request !== null &&
                    request.method && <MethodBadge method={request.method} />}
                  <span className="truncate text-caption">{name}</span>
                </Button>
              ),
            )}
          </div>
        )
      },
      [isSearching],
    )

    const processCollection = useCallback(
      (importedCollection: PostmanCollection[]) => {
        return importedCollection.map((collection, index) => {
          return (
            <Collapsible
              key={`${collection.info._postman_id ?? collection.info.name}-${index}`}
              defaultOpen
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="collectionFolder"
                  size="sm"
                  className="group w-full justify-start gap-2 transition-none"
                >
                  <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                  <FolderIcon />
                  <span className="truncate">{collection.info.name}</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 ml-5">
                {renderItems(collection.item)}
              </CollapsibleContent>
            </Collapsible>
          )
        })
      },
      [renderItems],
    )

    const renderedCollections = useMemo(() => {
      return processCollection(filteredCollections)
    }, [filteredCollections, processCollection])

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title">
          Collections
        </h1>

        <div className="flex items-center justify-between my-4">
          <p className="text-color-secondary text-body">
            Saved requests are grouped by purpose, not placed in the global
            sidebar.
          </p>

          <input
            type="file"
            accept=".json"
            ref={collectionFileInputRef}
            hidden
            onChange={handleCollectionFileChange}
          />
          <Button
            onClick={openCollectionFilePicker}
            disabled={isLoadingCollections}
          >
            <Plus className="h-4 w-4" />
            <span>Import Collection</span>
          </Button>
        </div>

        <Card className="h-[calc(100svh-152px)] min-h-96 bg-surface py-0">
          <CardContent className="grid min-h-0 flex-1 grid-cols-[30rem_auto_1fr] p-0">
            <section className="px-5 pt-5 flex flex-col gap-5 min-h-0">
              <div className="flex justify-between">
                <h1 className="text-color-primary">All collections</h1>
              </div>
              <Field>
                <InputGroup className="border-border">
                  <InputGroupInput
                    placeholder="Search collections or requests"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  <InputGroupAddon align="inline-start">
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {isLoadingCollections ? (
                    <p className="text-color-secondary">
                      Loading collections...
                    </p>
                  ) : filteredCollections.length === 0 ? (
                    <PlaceholderState
                      title={
                        normalizedSearch
                          ? "No matching results"
                          : "No collections yet"
                      }
                      description={
                        normalizedSearch
                          ? "Try adjusting your search."
                          : "Import a Postman collection to get started."
                      }
                      variant="inline"
                      icon={normalizedSearch ? SearchX : FolderPlus}
                      showBorder={false}
                    />
                  ) : (
                    renderedCollections
                  )}
                </div>
              </div>
              <CardFooter className="shrink-0 border-t-surface-subtle text-caption text-color-muted">
                {collections.length}{" "}
                {collections.length === 1 ? "collection" : "collections"}
                {" · "}
                {requestCount} {requestCount === 1 ? "request" : "requests"}
              </CardFooter>
            </section>
            <Separator orientation="vertical" className="bg-surface-subtle" />
            <section className="p-5">
              <div>
                <p className="text-color-secondary text-caption">
                  Commerce API / Products
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
        {/* <PlaceholderState
          variant="panel"
          icon={FolderOpen}
          title="No collection yet"
          description="Import a Postman collection to get started."
        /> */}
      </div>
    )
  },
})
