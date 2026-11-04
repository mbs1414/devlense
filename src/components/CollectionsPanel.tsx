import CollectionTree from "@/components/CollectionTree"
import PlaceholderState from "@/components/PlaceholderState"
import { CardFooter } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useCollectionSearch } from "@/hooks/useCollectionSearch"
import { FolderPlus, Search, SearchX } from "lucide-react"
import { useMemo } from "react"

interface Props {
  collections: PostmanCollection[]
  isLoadingCollections: boolean
  onSelectRequest?: (
    request: PostmanRequest,
    item: PostmanItem,
    path: string,
  ) => void
}

export default function CollectionsPanel({
  collections,
  isLoadingCollections,
  onSelectRequest,
}: Props) {
  const {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    isSearching,
    filteredCollections,
  } = useCollectionSearch(collections)
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

  return (
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
            <p className="text-color-secondary">Loading collections...</p>
          ) : filteredCollections.length === 0 ? (
            <PlaceholderState
              title={
                normalizedSearch ? "No matching results" : "No collections yet"
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
            <CollectionTree
              filteredCollections={filteredCollections}
              isSearching={isSearching}
              onSelectRequest={onSelectRequest}
            />
          )}
        </div>
      </div>
      <CardFooter className="shrink-0 border-t-border-subtle text-caption text-color-muted">
        {collections.length}{" "}
        {collections.length === 1 ? "collection" : "collections"}
        {" · "}
        {requestCount} {requestCount === 1 ? "request" : "requests"}
      </CardFooter>
    </section>
  )
}
