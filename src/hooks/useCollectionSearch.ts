import { useEffect, useMemo, useState } from "react"

export function useCollectionSearch(collections: PostmanCollection[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [searchQuery])

  const normalizedSearch = debouncedSearch.trim().toLowerCase()

  const isSearching = normalizedSearch.length > 0

  const filteredCollections = useMemo(() => {
    // No search? Return the original collections.
    if (!normalizedSearch) {
      return collections
    }

    const filterItems = (items: PostmanItem[]): PostmanItem[] => {
      return items.reduce<PostmanItem[]>((result, currentItem) => {
        const nameMatches = (currentItem.name ?? "")
          .toLowerCase()
          .includes(normalizedSearch)

        if (nameMatches) {
          result.push(currentItem)
          return result
        }

        if (currentItem.item) {
          const matchingChildren = filterItems(currentItem.item)

          if (matchingChildren.length > 0) {
            result.push({
              ...currentItem,
              item: matchingChildren,
            })
          }
        }

        return result
      }, [])
    }

    return collections.reduce<PostmanCollection[]>((result, collection) => {
      const collectionMatches = collection.info.name
        .toLowerCase()
        .includes(normalizedSearch)

      if (collectionMatches) {
        result.push(collection)
        return result
      }

      const matchingItems = filterItems(collection.item)

      if (matchingItems.length > 0) {
        result.push({
          ...collection,
          item: matchingItems,
        })
      }

      return result
    }, [])
  }, [collections, normalizedSearch])

  return {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    isSearching,
    filteredCollections,
  }
}
