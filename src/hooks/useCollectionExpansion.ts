import { useCallback, useEffect, useState } from "react"

const storageKey = "devlens-collection-expansion"
const changeEvent = "devlens-collection-expansion-change"

function readExpansion(): Record<string, boolean> {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}")
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {}
    return Object.entries(saved).reduce<Record<string, boolean>>(
      (result, [key, value]) => {
        if (typeof value === "boolean") result[key] = value
        return result
      },
      {},
    )
  } catch {
    return {}
  }
}

export function useCollectionExpansion() {
  const [expandedFolders, setExpandedFolders] = useState(readExpansion)

  useEffect(() => {
    const handleChange = () => setExpandedFolders(readExpansion())
    window.addEventListener("storage", handleChange)
    window.addEventListener(changeEvent, handleChange)
    return () => {
      window.removeEventListener("storage", handleChange)
      window.removeEventListener(changeEvent, handleChange)
    }
  }, [])

  const setFolderOpen = useCallback((key: string, open: boolean) => {
    setExpandedFolders((previous) => ({ ...previous, [key]: open }))
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...readExpansion(), [key]: open }),
      )
      window.dispatchEvent(new Event(changeEvent))
    } catch {
      // Keep folder toggles working when browser storage is unavailable.
    }
  }, [])

  return { expandedFolders, setFolderOpen }
}
