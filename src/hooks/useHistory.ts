import { useCallback } from "react"

import { useIndexedDB } from "@/hooks/useIndexedDB"

export function useHistory() {
  const { openDatabase } = useIndexedDB<RequestHistory>()

  const saveHistoryToIndexedDB = useCallback(
    async (entry: RequestHistory) => {
      const db = await openDatabase()

      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction("history", "readwrite")
        const store = transaction.objectStore("history")

        store.add(entry)

        // Keep the latest 100 requests.
        const request = store.index("createdAt").openCursor(null, "prev")
        let count = 0

        request.onsuccess = () => {
          const cursor = request.result
          if (!cursor) return

          count += 1
          if (count > 100) cursor.delete()
          cursor.continue()
        }

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
    [openDatabase],
  )

  const loadHistoryFromIndexedDB = useCallback(async () => {
    const db = await openDatabase()

    return new Promise<RequestHistory[]>((resolve, reject) => {
      const transaction = db.transaction("history", "readonly")
      const request = transaction.objectStore("history").getAll()

      transaction.oncomplete = () => {
        db.close()
        const history = request.result as RequestHistory[]
        resolve(history.sort((a, b) => b.createdAt - a.createdAt))
      }

      transaction.onabort = () => {
        db.close()
        reject(transaction.error ?? new Error("Load failed"))
      }
    })
  }, [openDatabase])

  return { saveHistoryToIndexedDB, loadHistoryFromIndexedDB }
}
