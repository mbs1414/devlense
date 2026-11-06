export function findRequestPath(
  items: PostmanItem[],
  target: PostmanItem,
  parentPath = "",
): string | null {
  for (const [index, item] of items.entries()) {
    const path = parentPath ? `${parentPath}.${index}` : String(index)
    if (item === target) return path
    if (item.item) {
      const found = findRequestPath(item.item, target, path)
      if (found !== null) return found
    }
  }
  return null
}

export function getRequestAtPath(items: PostmanItem[], path: string) {
  if (!/^\d+(\.\d+)*$/.test(path)) return undefined
  let item: PostmanItem | undefined
  for (const index of path.split(".")) {
    item = items[Number(index)]
    if (!item) return undefined
    items = item.item ?? []
  }
  return item
}
