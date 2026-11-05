import MethodBadge from "@/components/MethodBadge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRightIcon, FolderIcon, Trash2 } from "lucide-react"
import { useCallback, useMemo, type ReactNode } from "react"

interface Props {
  filteredCollections: PostmanCollection[]
  isSearching: boolean
  selectedRequest?: PostmanItem | null
  onDeleteCollection?: (collection: PostmanCollection) => void
  deletingCollectionId?: string
  onSelectRequest?: (
    request: PostmanRequest,
    item: PostmanItem,
    path: string,
    collection: PostmanCollection,
  ) => void
}

export default function CollectionTree({
  filteredCollections,
  isSearching,
  selectedRequest,
  onSelectRequest,
  onDeleteCollection,
  deletingCollectionId,
}: Props) {
  const renderItems = useCallback(
    function renderItems(
      items: PostmanItem[],
      path: string,
      collection: PostmanCollection,
    ): ReactNode {
      return (
        <div className="flex flex-col gap-1">
          {items.map((requestItem, index) => {
            const { name, item, request } = requestItem
            return item ? (
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
                  {renderItems(
                    item,
                    `${path} / ${name ?? "Untitled folder"}`,
                    collection,
                  )}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button
                variant="collectionApi"
                size="sm"
                key={index}
                data-selected={selectedRequest === requestItem}
                aria-current={
                  selectedRequest === requestItem ? true : undefined
                }
                className="w-full justify-start gap-2 text-foreground data-[selected=true]:bg-active data-[selected=true]:hover:bg-active"
                onClick={() => {
                  if (request != null) {
                    onSelectRequest?.(request, requestItem, path, collection)
                  }
                }}
              >
                {typeof request === "object" &&
                  request !== null &&
                  request.method && (
                    <MethodBadge
                      method={request.method}
                      className="h-5 px-1.5 py-0 text-[10px] leading-none"
                    />
                  )}
                <span className="truncate text-caption">{name}</span>
              </Button>
            )
          })}
        </div>
      )
    },
    [isSearching, onSelectRequest, selectedRequest],
  )

  const processCollection = useCallback(
    (importedCollection: PostmanCollection[]) => {
      return importedCollection.map((collection, index) => {
        return (
          <Collapsible
            key={
              collection.databaseId ??
              `${collection.info._postman_id ?? collection.info.name}-${index}`
            }
            defaultOpen
          >
            <div className="flex items-center gap-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant="collectionFolder"
                  size="sm"
                  className="group min-w-0 flex-1 justify-start gap-2 transition-none"
                >
                  <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                  <FolderIcon />
                  <span className="truncate">{collection.info.name}</span>
                </Button>
              </CollapsibleTrigger>
              {onDeleteCollection && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${collection.info.name}`}
                  title={`Delete ${collection.info.name}`}
                  className="text-color-muted hover:text-destructive"
                  disabled={
                    !collection.databaseId || Boolean(deletingCollectionId)
                  }
                  onClick={() => onDeleteCollection(collection)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <CollapsibleContent className="mt-1 ml-5">
              {renderItems(collection.item, collection.info.name, collection)}
            </CollapsibleContent>
          </Collapsible>
        )
      })
    },
    [renderItems, onDeleteCollection, deletingCollectionId],
  )

  const renderedCollections = useMemo(() => {
    return processCollection(filteredCollections)
  }, [filteredCollections, processCollection])

  return <>{renderedCollections}</>
}
