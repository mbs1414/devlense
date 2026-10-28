import MethodBadge from "@/components/MethodBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  ChevronsDownUp,
  FolderIcon,
  Plus,
  Search,
} from "lucide-react"
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
    }

    const processCollection = (importedCollection: PostmanCollection[]) => {
      return importedCollection.map((collection, index) => (
        <Collapsible key={collection.info._postman_id ?? index} defaultOpen>
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

        <Card className="h-[60svh] min-h-96 bg-surface py-0">
          <CardContent className="grid min-h-0 flex-1 grid-cols-[30rem_1fr] p-0">
            <section className="p-5 flex flex-col gap-5 min-h-0">
              <div className="flex justify-between">
                <h1 className="text-color-primary">All collections</h1>
                <div className="flex items-center gap-2">
                  <div className="text-color-muted text-body">3</div>
                  <ChevronsDownUp className="size-4 text-color-secondary" />
                </div>
              </div>
              <Field>
                <InputGroup className="border-border">
                  <InputGroupInput placeholder="Search collections or requests" />
                  <InputGroupAddon align="inline-start">
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {processCollection(collections)}
              </div>
            </section>
            <Separator orientation="vertical" />
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
