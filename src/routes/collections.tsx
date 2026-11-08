import CollectionRequestDetails from "@/components/CollectionRequestDetails"
import CollectionsPanel from "@/components/CollectionsPanel"
import CollectionsSplitPanels from "@/components/CollectionsSplitPanels"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCollections } from "@/hooks/useCollections"
import { useImportPostmanCollection } from "@/hooks/useImportPostmanCollection"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { findRequestPath } from "@/lib/collectionRequestPath"
import { Plus, Upload } from "lucide-react"
import { useRef, useState, type DragEvent } from "react"
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
      collectionFileInputRef,
      openCollectionFilePicker,
      handleCollectionFileChange,
      importCollectionFiles,
      isImporting,
      importErrors,
    } = useImportPostmanCollection(addCollection)

    const [selectedRequest, setSelectedRequest] = useState<{
      item: PostmanItem
      path: string
      collectionId: string
    } | null>(null)
    const [deletingCollectionId, setDeletingCollectionId] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const dragDepth = useRef(0)

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return
      event.preventDefault()
      dragDepth.current += 1
      if (!isImporting && !isLoadingCollections) setIsDragging(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return
      dragDepth.current = Math.max(0, dragDepth.current - 1)
      if (dragDepth.current === 0) setIsDragging(false)
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return
      event.preventDefault()
      event.dataTransfer.dropEffect =
        isImporting || isLoadingCollections ? "none" : "copy"
    }

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return
      event.preventDefault()
      dragDepth.current = 0
      setIsDragging(false)
      if (isImporting || isLoadingCollections) return

      await importCollectionFiles(Array.from(event.dataTransfer.files))
    }

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
      <div
        className="relative h-full min-w-0 flex flex-col xl:h-[calc(100dvh-3rem)] xl:min-h-128"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h1 className="hidden md:block shrink-0 text-color-primary font-semibold text-page-title">
          Collections
        </h1>

        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
          <p className="text-color-secondary text-body">
            Drag and drop Postman JSON files here, or import multiple
            collections.
          </p>

          <input
            type="file"
            accept=".json,application/json"
            multiple
            ref={collectionFileInputRef}
            hidden
            onChange={handleCollectionFileChange}
          />
          <Button
            onClick={openCollectionFilePicker}
            disabled={isLoadingCollections || isImporting}
          >
            <Plus className="h-4 w-4" />
            <span>{isImporting ? "Importing..." : "Import Collections"}</span>
          </Button>
        </div>

        {importErrors.length > 0 && (
          <ul
            role="alert"
            className="shrink-0 text-caption text-status-error-fg mb-4 space-y-1"
          >
            {importErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        {isDragging && (
          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-action-primary bg-surface/95">
            <Upload className="size-10 text-color-accent" />
            <p className="text-section-title text-color-primary">
              Drop Postman collections here
            </p>
            <p className="text-caption text-color-secondary">
              You can drop multiple JSON files at once.
            </p>
          </div>
        )}

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
      </div>
    )
  },
})
