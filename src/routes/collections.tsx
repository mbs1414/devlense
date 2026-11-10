import CollectionRequestDetails from "@/components/CollectionRequestDetails"
import CollectionsPanel from "@/components/CollectionsPanel"
import CollectionsSplitPanels from "@/components/CollectionsSplitPanels"
import CollectionImportDropZone from "@/components/CollectionImportDropZone"
import ImportCollectionsButton, {
  CollectionImportFeedback,
} from "@/components/ImportCollectionsButton"
import { Card, CardContent } from "@/components/ui/card"
import { useCollections } from "@/hooks/useCollections"
import { useImportPostmanCollection } from "@/hooks/useImportPostmanCollection"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { findRequestPath } from "@/lib/collectionRequestPath"
import { useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const navigate = useNavigate()
    const {
      collections,
      isLoadingCollections,
      addCollection,
      deleteCollection,
    } = useCollections()
    const {
      importCollectionFiles,
      isImporting,
      importMessage,
      importErrors,
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

    const handleOpenRequest = () => {
      const collection = collections.find(
        (collection) => collection.databaseId === selectedRequest?.collectionId,
      )
      const requestPath =
        collection && selectedRequest
          ? findRequestPath(collection.item, selectedRequest.item)
          : null

      if (!collection?.databaseId || requestPath === null) {
        toast.error(
          "Unable to open this request. Select it again and try again.",
        )
        return
      }

      void navigate({
        to: "/request",
        state: {
          requestToOpen: { collectionId: collection.databaseId, requestPath },
        },
      })
    }

    return (
      <CollectionImportDropZone
        className="h-full min-w-0 flex flex-col xl:h-[calc(100dvh-3rem)] xl:min-h-128"
        onImport={importCollectionFiles}
        disabled={isImporting || isLoadingCollections}
      >
        <h1 className="hidden md:block shrink-0 text-color-primary font-semibold text-page-title">
          Collections
        </h1>

        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
          <p className="text-color-secondary text-body">
            Drag and drop Postman JSON files here, or import multiple
            collections.
          </p>

          <ImportCollectionsButton
            onImport={importCollectionFiles}
            isImporting={isImporting}
            disabled={isLoadingCollections}
          />
        </div>

        <CollectionImportFeedback message={importMessage} errors={importErrors} />

        <CollectionsSplitPanels
          layoutId="devlens-collections-panels"
          fillHeight
          collections={
            <Card className="min-w-0 bg-surface py-0 xl:h-full xl:min-h-0 ring-0 border border-border-subtle">
              <CardContent className="grid min-h-0 flex-1 p-0">
                <CollectionsPanel
                  collections={collections}
                  isLoadingCollections={isLoadingCollections}
                  onSelectRequest={handleSelectRequest}
                  onDeleteCollection={handleDeleteCollection}
                  deletingCollectionId={deletingCollectionId}
                />
              </CardContent>
            </Card>
          }
        >
          <Card className="min-w-0 bg-surface py-0 xl:h-full xl:min-h-0 ring-0 border border-border-subtle">
            <CardContent
              className="flex flex-col min-w-0 min-h-0 flex-1 p-0 xl:overflow-y-auto"
              role="region"
              aria-label="Request details"
              tabIndex={0}
            >
              <CollectionRequestDetails
                item={selectedRequest?.item ?? null}
                path={selectedRequest?.path ?? ""}
                onOpenRequest={handleOpenRequest}
              />
            </CardContent>
          </Card>
        </CollectionsSplitPanels>
        {/* <PlaceholderState
          variant="panel"
          icon={FolderOpen}
          title="No collection yet"
          description="Import a Postman collection to get started."
        /> */}
      </CollectionImportDropZone>
    )
  },
})
