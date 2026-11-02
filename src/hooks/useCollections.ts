import { useIndexedDB } from "@/hooks/useIndexedDB"
import { useCallback, useEffect, useState } from "react"

export function useCollections() {
  const [collections, setCollections] = useState<PostmanCollection[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const { saveCollectionToIndexedDB, loadCollectionsFromIndexedDB } =
    useIndexedDB<PostmanCollection>()

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

  const addCollection = useCallback(
    async (collection: PostmanCollection) => {
      await saveCollectionToIndexedDB(collection)
      setCollections((previous) => [...previous, collection])
    },
    [saveCollectionToIndexedDB],
  )

  return { collections, isLoadingCollections, addCollection }
}
