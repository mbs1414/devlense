import CollectionRequestDetails from "@/components/CollectionRequestDetails"
import CollectionsPanel from "@/components/CollectionsPanel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useImportPostmanCollection } from "@/hooks/useImportPostmanCollection"
import { useIndexedDB } from "@/hooks/useIndexedDB"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const [collections, setCollections] = useState<PostmanCollection[]>([])
    const [isLoadingCollections, setIsLoadingCollections] = useState(true)
    const { saveCollectionToIndexedDB, loadCollectionsFromIndexedDB } =
      useIndexedDB<PostmanCollection>()
    const {
      collectionFileInputRef,
      openCollectionFilePicker,
      handleCollectionFileChange,
    } = useImportPostmanCollection(async (collection) => {
      await saveCollectionToIndexedDB(collection)
      setCollections((previous) => [...previous, collection])
    })

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
    }, [loadCollectionsFromIndexedDB])

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
            <CollectionsPanel
              collections={collections}
              isLoadingCollections={isLoadingCollections}
            />
            <Separator orientation="vertical" className="bg-surface-subtle" />
            <CollectionRequestDetails />
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
