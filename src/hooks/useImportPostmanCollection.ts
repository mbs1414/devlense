import { useRef, type ChangeEvent } from "react"

export function useImportPostmanCollection(
  onImport: (collection: PostmanCollection) => void | Promise<void>,
) {
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

    event.currentTarget.value = ""

    if (!file) return

    try {
      // Step 1: Read the selected JSON file
      const text = await file.text()

      // Step 2: Convert JSON text into an object
      const collection: unknown = JSON.parse(text)

      // Step 3: Validate the Postman collection
      if (!isPostmanCollection(collection)) {
        console.error("Please select a valid Postman collection.")
        return
      }

      await onImport(collection)

      console.log("Collection saved successfully!")
    } catch (error) {
      console.error("Failed to import collection:", error)
    }
  }

  return {
    collectionFileInputRef,
    openCollectionFilePicker,
    handleCollectionFileChange,
  }
}
