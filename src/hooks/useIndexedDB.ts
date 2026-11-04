import { useCallback } from "react"

const DB_NAME = "postman-collections-db"
const DB_VERSION = 3
const STORE_NAME = "collections"

interface Options {
  databaseName?: string
  version?: number
  storeName?: string
}

export function useIndexedDB<T>({
  databaseName = DB_NAME,
  version = DB_VERSION,
  storeName = STORE_NAME,
}: Options = {}) {
  // 1. Open the IndexedDB database
  const openDatabase = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, version)

      request.onupgradeneeded = () => {
        const db = request.result

        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            autoIncrement: true,
          })
        }

        if (!db.objectStoreNames.contains("environments")) {
          const environments = db.createObjectStore("environments", {
            keyPath: "id",
          })

          environments.add({
            id: "development",
            name: "Development",
            active: true,
            variables: [],
          })
        }

        if (!db.objectStoreNames.contains("history")) {
          const history = db.createObjectStore("history", { keyPath: "id" })
          history.createIndex("createdAt", "createdAt")
        }
      }

      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close()
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }, [databaseName, version, storeName])

  // 2. Save a collection into IndexedDB
  const saveCollectionToIndexedDB = useCallback(
    async (collection: T): Promise<void> => {
      const db = await openDatabase()

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite")

        transaction.objectStore(storeName).add(collection)

        transaction.oncomplete = () => {
          db.close()
          resolve()
        }

        transaction.onabort = () => {
          db.close()
          reject(transaction.error ?? new Error("Save failed"))
        }
      })
    },
    [openDatabase, storeName],
  )

  // 3. Load all previously saved collections
  const loadCollectionsFromIndexedDB = useCallback(async (): Promise<T[]> => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly")
      const request = transaction.objectStore(storeName).getAll()
      const keysRequest = transaction.objectStore(storeName).getAllKeys()

      let collections: T[] = []

      request.onsuccess = () => {
        collections = request.result as T[]
      }

      transaction.oncomplete = () => {
        db.close()
        resolve(
          collections.map((collection, index) => ({
            ...collection,
            databaseId: String(keysRequest.result[index]),
          })),
        )
      }

      transaction.onabort = () => {
        db.close()
        reject(transaction.error ?? new Error("Load failed"))
      }
    })
  }, [openDatabase, storeName])

  return {
    openDatabase,
    saveCollectionToIndexedDB,
    loadCollectionsFromIndexedDB,
  }
}
