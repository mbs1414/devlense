import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useIndexedDB } from "@/hooks/useIndexedDB"
import { getCollectionEnvironment } from "@/lib/getCollectionEnvironment"

export function useEnvironments({
  showToasts = true,
}: { showToasts?: boolean } = {}) {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [isLoadingEnvironments, setIsLoadingEnvironments] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState("")
  const { openDatabase } = useIndexedDB<Environment>()

  useEffect(() => {
    let cancelled = false

    const loadEnvironments = async () => {
      try {
        const db = await openDatabase()
        const savedEnvironments = await new Promise<Environment[]>(
          (resolve, reject) => {
            const transaction = db.transaction(
              ["environments", "collections"],
              "readonly",
            )
            const request = transaction.objectStore("environments").getAll()
            const collectionsRequest = transaction
              .objectStore("collections")
              .getAll()
            const collectionKeysRequest = transaction
              .objectStore("collections")
              .getAllKeys()

            transaction.oncomplete = () => {
              db.close()
              const environments = request.result as Environment[]
              const collections =
                collectionsRequest.result as PostmanCollection[]

              collections.forEach((collection, index) => {
                if (!collection.variable?.length) return

                const collectionId = String(collectionKeysRequest.result[index])
                const id = `collection:${collectionId}`

                if (environments.some((environment) => environment.id === id))
                  return

                environments.push(
                  getCollectionEnvironment(collection, collectionId),
                )
              })

              resolve(environments)
            }

            transaction.onabort = () => {
              db.close()
              reject(transaction.error ?? new Error("Load failed"))
            }
          },
        )

        if (!cancelled) {
          setEnvironments(savedEnvironments)
          setHasLoaded(true)
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load environments")
          if (showToasts) toast.error("Unable to load environments")
        }
      } finally {
        if (!cancelled) setIsLoadingEnvironments(false)
      }
    }

    void loadEnvironments()

    return () => {
      cancelled = true
    }
  }, [openDatabase, showToasts])

  useEffect(() => {
    if (!hasLoaded) return

    const saveEnvironments = async () => {
      try {
        const db = await openDatabase()

        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction("environments", "readwrite")
          const store = transaction.objectStore("environments")

          store.clear()

          environments.forEach((environment) => {
            store.put({
              ...environment,
              variables: environment.variables.map((variable) => ({
                ...variable,
                visible: false,
              })),
            })
          })

          transaction.oncomplete = () => {
            db.close()
            resolve()
          }

          transaction.onabort = () => {
            db.close()
            reject(transaction.error ?? new Error("Save failed"))
          }
        })
        setError("")
      } catch {
        setError("Unable to save environments")
        if (showToasts) toast.error("Unable to save environments")
      }
    }

    void saveEnvironments()
  }, [environments, hasLoaded, openDatabase, showToasts])

  return {
    environments,
    setEnvironments,
    isLoadingEnvironments,
    hasLoaded,
    error,
  }
}
