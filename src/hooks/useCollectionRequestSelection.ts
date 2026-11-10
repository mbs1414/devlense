import { useState } from "react"
import { findRequestPath, getRequestAtPath } from "@/lib/collectionRequestPath"

interface Selection {
  collectionId: string
  requestPath: string
  path: string
}

function readSelection(storageKey: string): Selection | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null")
    if (
      saved &&
      typeof saved.collectionId === "string" &&
      typeof saved.requestPath === "string" &&
      /^\d+(\.\d+)*$/.test(saved.requestPath) &&
      typeof saved.path === "string"
    ) {
      return saved
    }
  } catch {
    // Keep selection working when browser storage is unavailable.
  }
  return null
}

export function useCollectionRequestSelection(
  collections: PostmanCollection[],
  page: "request" | "collections",
) {
  const storageKey = `devlens-${page}-selected-request`
  const [selection, setSelection] = useState(() => readSelection(storageKey))
  const selectedCollection = collections.find(
    (collection) => collection.databaseId === selection?.collectionId,
  )
  const item =
    selectedCollection && selection
      ? getRequestAtPath(selectedCollection.item, selection.requestPath)
      : undefined
  const selectedItem = item?.request != null ? item : null

  const updateSelection = (next: Selection | null) => {
    setSelection(next)
    try {
      if (next) sessionStorage.setItem(storageKey, JSON.stringify(next))
      else sessionStorage.removeItem(storageKey)
    } catch {
      // Keep selection working when browser storage is unavailable.
    }
  }

  const selectRequest = (
    item: PostmanItem,
    path: string,
    collection: PostmanCollection,
  ) => {
    const originalCollection = collections.find(
      (entry) => entry.databaseId === collection.databaseId,
    )
    const requestPath = originalCollection
      ? findRequestPath(originalCollection.item, item)
      : null
    if (!collection.databaseId || requestPath === null) return
    const next = { collectionId: collection.databaseId, requestPath, path }
    updateSelection(next)
    return next
  }

  return {
    selection,
    selectedItem,
    selectedCollection,
    selectRequest,
    clearSelection: () => updateSelection(null),
  }
}
