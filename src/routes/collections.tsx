import CollectionRequestDetails from "@/components/CollectionRequestDetails"
import CollectionsPanel from "@/components/CollectionsPanel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCollections } from "@/hooks/useCollections"
import { useImportPostmanCollection } from "@/hooks/useImportPostmanCollection"
import { createFileRoute } from "@tanstack/react-router"
import { Plus, Upload } from "lucide-react"
import { useRef, useState, type DragEvent } from "react"
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

    return (
      <div
        className="relative h-full flex flex-col"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h1 className="text-color-primary font-semibold text-page-title">
          Collections
        </h1>

        <div className="flex items-center justify-between my-4">
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

        {importMessage && (
          <p role="status" className="text-caption text-color-secondary mb-4">
            {importMessage}
          </p>
        )}
        {importErrors.length > 0 && (
          <ul
            role="alert"
            className="text-caption text-status-error-fg mb-4 space-y-1"
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
