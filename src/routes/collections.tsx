import MethodBadge from "@/components/MethodBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { createFileRoute } from "@tanstack/react-router"
import { ChevronRightIcon, FileIcon, FolderIcon, Plus } from "lucide-react"
import { useRef, useState, type ChangeEvent, type ReactNode } from "react"

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const [collections, setCollections] = useState<PostmanCollection[]>([])
    const collectionFileInputRef = useRef<HTMLInputElement>(null)

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
      event.currentTarget.value = "" // Allow selecting the same file again

      if (!file) return
      try {
        const text = await file.text()
        const collection: unknown = JSON.parse(text)

        if (!isPostmanCollection(collection)) {
          console.error("Please select a valid Postman collection.")
          return
        }

        setCollections((previous) => [...previous, collection])
      } catch (error) {
        console.log(error)
      }
    }

    const renderItems = (items: PostmanItem[]): ReactNode => {
      return (
        <div className="flex flex-col gap-1">
          {items.map(({ name, item, request }, index) =>
            item ? (
              <Collapsible key={index}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
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
                variant="outline"
                key={index}
                className="w-full justify-start gap-2 text-foreground"
              >
                {typeof request === "object" &&
                  request !== null &&
                  request.method && <MethodBadge method={request.method} />}
                <span className="truncate">{name}</span>
              </Button>
            ),
          )}
        </div>
      )
    }

    const processCollection = (importedCollection: PostmanCollection[]) => {
      return importedCollection.map((collection, index) => (
        <div key={collection.info._postman_id ?? index}>
          <h1 className="text-page-title">{collection.info.name}</h1>
          {renderItems(collection.item)}
        </div>
      ))
    }

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
          <Button onClick={openCollectionFilePicker}>
            <Plus className="h-4 w-4" />
            <span>Import Collection</span>
          </Button>
        </div>

        <Card className="flex-1 bg-surface">
          <CardContent className="grid grid-cols-[30rem_1fr]">
            <div className="px-2 border border-red-50">{processCollection(collections)}</div>
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
