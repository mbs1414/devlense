import { useRef, useState, type ChangeEvent } from "react"

export function useImportPostmanCollection(
  onImport: (collection: PostmanCollection) => void | Promise<void>,
) {
  const collectionFileInputRef = useRef<HTMLInputElement>(null)
  const importingRef = useRef(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState("")
  const [importErrors, setImportErrors] = useState<string[]>([])

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

  const importCollectionFiles = async (files: File[]) => {
    if (importingRef.current || files.length === 0) return

    importingRef.current = true
    setIsImporting(true)
    setImportMessage("")
    setImportErrors([])
    const errors: string[] = []
    let importedCount = 0

    try {
      for (const file of files) {
        try {
          const text = await file.text()
          const collection: unknown = JSON.parse(text.replace(/^\uFEFF/, ""))

          if (!isPostmanCollection(collection)) {
            errors.push(`${file.name}: Not a valid Postman collection.`)
            continue
          }

          await onImport(collection)
          importedCount += 1
        } catch {
          errors.push(
            `${file.name}: Unable to import this file. Check that it is a valid Postman JSON collection.`,
          )
        }
      }

      if (importedCount > 0) {
        setImportMessage(
          `Imported ${importedCount} ${importedCount === 1 ? "collection" : "collections"}.`,
        )
      }
      setImportErrors(errors)
    } finally {
      importingRef.current = false
      setIsImporting(false)
    }
  }

  const handleCollectionFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? [])
    event.currentTarget.value = ""
    await importCollectionFiles(files)
  }

  return {
    collectionFileInputRef,
    openCollectionFilePicker,
    handleCollectionFileChange,
    importCollectionFiles,
    isImporting,
    importMessage,
    importErrors,
  }
}
