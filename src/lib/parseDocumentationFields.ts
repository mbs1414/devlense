export function parseDocumentationFields(text: string) {
  const lines = text.split("\n").filter((line) => line.trim())
  if (lines.length < 2) return null

  const fields: { name: string; description: string }[] = []
  for (const line of lines) {
    const match = line
      .trim()
      .match(/^([A-Za-z_]\w*)(?:\s*:\s*(.*)|[ \t]{2,}(.+))?$/)
    if (!match) return null
    fields.push({
      name: match[1],
      description: (match[2] ?? match[3] ?? "").trim(),
    })
  }

  return fields.some((field) => /[\u0600-\u06ff]/.test(field.description))
    ? fields
    : null
}
