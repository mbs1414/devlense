import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"

type PostmanCollection = {
  info: {
    name: string
    schema: string
  }
  item: unknown[]
}

type ImportedCollection = {
  id: string
  data: PostmanCollection
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

export const Route = createFileRoute("/collections")({
  component: function CollectionsComponent() {
    const [collections, setCollections] = useState<ImportedCollection[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImport = async (file: File) => {
      try {
        const text = await file.text()
        const data: unknown = JSON.parse(text)

        if (!isPostmanCollection(data)) {
          throw new Error(
            "The file does not have a Postman collection structure",
          )
        }

        setCollections((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            data,
          },
        ])
      } catch (error) {
        console.error("Failed to import collection:", error)
      }
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0]
      event.currentTarget.value = ""

      if (file) {
        await handleImport(file)
      }
    }

    function CollectionItems({ items }: { items: unknown[] }) {
      return (
        <ul className="space-y-2">
          {items.map((item, index) => {
            if (
              typeof item !== "object" ||
              item === null ||
              !("name" in item) ||
              typeof item.name !== "string"
            ) {
              return null
            }

            // Folder: render its children recursively.
            if ("item" in item && Array.isArray(item.item)) {
              return (
                <li key={index}>
                  <details>
                    <summary className="cursor-pointer font-medium">
                      {item.name}
                    </summary>

                    <div className="mt-2 border-l pl-4">
                      <CollectionItems items={item.item} />
                    </div>
                  </details>
                </li>
              )
            }

            if (!("request" in item)) return null

            const request = item.request
            const method =
              typeof request === "object" &&
              request !== null &&
              "method" in request &&
              typeof request.method === "string"
                ? request.method
                : "Request"

            return (
              <li key={index} className="flex items-center gap-3">
                <span className="font-mono text-sm text-color-accent">
                  {method}
                </span>
                <span>{item.name}</span>
              </li>
            )
          })}
        </ul>
      )
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
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={handleFileChange}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Plus className="h-4 w-4" />
            <span>Import Collection</span>
          </Button>
        </div>

        <Card className="flex-1 bg-surface">
          <CardContent className="space-y-4">
            {collections.length === 0 ? (
              <p>Import a Postman collection to get started.</p>
            ) : (
              collections.map(({ id, data }) => (
                <div key={id} className="rounded-lg border p-4">
                  <h2 className="font-semibold">{data.info.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {data.item.length} top-level items
                  </p>
                  <div key={id} className="rounded-lg border p-4">
                    <h2 className="mb-4 font-semibold">{data.info.name}</h2>
                    <CollectionItems items={data.item} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    )
  },
})
