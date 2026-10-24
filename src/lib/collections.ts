type PostmanCollection = {
  info: {
    name: string
    schema: string
  }
  item: unknown[]
}

export type ImportedCollection = {
  id: string
  data: PostmanCollection
}

export const isPostmanCollection = (
  data: unknown,
): data is PostmanCollection => {
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

export function isNamedItem(item: unknown): item is Record<string, unknown> & {
  name: string
} {
  return (
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    typeof item.name === "string"
  )
}

export function countRequests(items: unknown[]): number {
  return items.reduce<number>((total, item) => {
    if (!isNamedItem(item)) return total
    if (Array.isArray(item.item)) return total + countRequests(item.item)
    return total + ("request" in item ? 1 : 0)
  }, 0)
}

export function filterItems(items: unknown[], query: string): unknown[] {
  return items.flatMap((item) => {
    if (!isNamedItem(item)) return []
    if (item.name.toLowerCase().includes(query)) return [item]
    if (Array.isArray(item.item)) {
      const children = filterItems(item.item, query)
      return children.length > 0 ? [{ ...item, item: children }] : []
    }
    return []
  })
}
