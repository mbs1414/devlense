import MethodBadge from "@/components/MethodBadge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRightIcon, FolderIcon } from "lucide-react"
import { useCallback, useMemo, type ReactNode } from "react"

interface Props {
  filteredCollections: PostmanCollection[]
  isSearching: boolean
}

export default function CollectionTree({
  filteredCollections,
  isSearching,
}: Props) {
  const renderItems = useCallback(
    function renderItems(items: PostmanItem[]): ReactNode {
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

  return <>{renderedCollections}</>
}
