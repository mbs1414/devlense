import { useIndexedDB } from "@/hooks/useIndexedDB"
import { useCallback, useEffect, useState } from "react"
import { getCollectionEnvironment } from "@/lib/getCollectionEnvironment"

export function useCollections() {
  const [collections, setCollections] = useState<PostmanCollection[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const { openDatabase, loadCollectionsFromIndexedDB } =
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
      const db = await openDatabase()

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(
          ["collections", "environments"],
          "readwrite",
        )
        const collectionRequest = transaction
          .objectStore("collections")
          .add(collection)
        const store = transaction.objectStore("environments")
        const request = store.getAll()

        request.onsuccess = () => {
          const environments = request.result as Environment[]
          environments.forEach((environment) =>
            store.put({ ...environment, active: false }),
          )
          store.put({
            ...getCollectionEnvironment(
              collection,
              String(collectionRequest.result),
            ),
            active: true,
          })
        }

        transaction.oncomplete = () => {
          db.close()
          resolve()
        }

        transaction.onabort = () => {
          db.close()
          reject(transaction.error ?? new Error("Unable to import collection"))
        }
      })
      setCollections(await loadCollectionsFromIndexedDB())
    },
    [openDatabase, loadCollectionsFromIndexedDB],
  )

  const deleteCollection = useCallback(
    async (id: string) => {
      const db = await openDatabase()

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(
          ["collections", "environments"],
          "readwrite",
        )

        transaction.objectStore("collections").delete(Number(id))
        transaction.objectStore("environments").delete(`collection:${id}`)

        transaction.oncomplete = () => {
          db.close()
          resolve()
        }

        transaction.onabort = () => {
          db.close()
          reject(transaction.error ?? new Error("Delete failed"))
        }
      })

      setCollections((previous) =>
        previous.filter((collection) => collection.databaseId !== id),
      )
    },
    [openDatabase],
  )

  return { collections, isLoadingCollections, addCollection, deleteCollection }
}
