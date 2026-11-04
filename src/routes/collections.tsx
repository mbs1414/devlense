import CollectionRequestDetails from "@/components/CollectionRequestDetails"
import CollectionsPanel from "@/components/CollectionsPanel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCollections } from "@/hooks/useCollections"
import { useImportPostmanCollection } from "@/hooks/useImportPostmanCollection"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const {
      collections,
      isLoadingCollections,
      addCollection,
      deleteCollection,
    } = useCollections()
    const {
      collectionFileInputRef,
      openCollectionFilePicker,
      handleCollectionFileChange,
    } = useImportPostmanCollection(addCollection)

    const [selectedRequest, setSelectedRequest] = useState<{
      item: PostmanItem
      path: string
      collectionId: string
    } | null>(null)
    const [deletingCollectionId, setDeletingCollectionId] = useState("")

    const handleSelectRequest = (
      _request: PostmanRequest,
      item: PostmanItem,
      path: string,
      collection: PostmanCollection,
    ) => {
      setSelectedRequest({
        item,
        path,
        collectionId: collection.databaseId ?? "",
      })
    }

    const handleDeleteCollection = async (collection: PostmanCollection) => {
      if (!collection.databaseId || deletingCollectionId) return

      setDeletingCollectionId(collection.databaseId)

      try {
        await deleteCollection(collection.databaseId)
        setSelectedRequest((previous) =>
          previous?.collectionId === collection.databaseId ? null : previous,
        )
        toast.success("Collection deleted")
      } catch {
        toast.error("Unable to delete collection")
      } finally {
        setDeletingCollectionId("")
      }
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
              onSelectRequest={handleSelectRequest}
              onDeleteCollection={handleDeleteCollection}
              deletingCollectionId={deletingCollectionId}
            />
            <Separator orientation="vertical" className="bg-border-subtle" />
            <CollectionRequestDetails
              item={selectedRequest?.item ?? null}
              path={selectedRequest?.path ?? ""}
            />
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
