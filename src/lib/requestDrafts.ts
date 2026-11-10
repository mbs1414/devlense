import type { RequestAuth } from "@/hooks/useRequestAuth"

export interface RequestDraft {
  method: string
  request: string
  requestBody: string
  bodyType: string
  queryParams: RequestField[]
  headers: RequestField[]
  encodedBodyFields: RequestField[]
  formDataFields: FormDataField[]
  authType: string
  auth: RequestAuth
  activeTab: string
}

const drafts = new Map<string, RequestDraft>()
const storagePrefix = "devlens-request-draft:"

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isField(value: unknown): value is RequestField {
  return (
    isRecord(value) &&
    ["id", "key", "value", "description"].every(
      (key) => typeof value[key] === "string",
    ) &&
    typeof value.enabled === "boolean"
  )
}

function isDraft(value: unknown): value is RequestDraft {
  if (!isRecord(value) || !isRecord(value.auth)) return false
  const auth = value.auth
  return (
    [
      "method",
      "request",
      "requestBody",
      "bodyType",
      "authType",
      "activeTab",
    ].every((key) => typeof value[key] === "string") &&
    ["queryParams", "headers", "encodedBodyFields"].every(
      (key) => Array.isArray(value[key]) && value[key].every(isField),
    ) &&
    Array.isArray(value.formDataFields) &&
    value.formDataFields.every(
      (field) =>
        isField(field) &&
        "type" in field &&
        (field.type === "text" || field.type === "file"),
    ) &&
    ["token", "username", "password", "apiKeyName", "apiKeyValue"].every(
      (key) => typeof auth[key] === "string",
    ) &&
    (auth.apiKeyLocation === "header" || auth.apiKeyLocation === "query-params")
  )
}

export function readRequestDraft(key: string): RequestDraft | null {
  const cached = drafts.get(key)
  if (cached) return cached

  try {
    const saved: unknown = JSON.parse(
      sessionStorage.getItem(`${storagePrefix}${key}`) ?? "null",
    )
    if (isDraft(saved)) {
      return {
        ...saved,
        formDataFields: saved.formDataFields.map((field) => ({
          ...field,
          files: [],
        })),
      }
    }
  } catch {
    // In-memory drafts still work when browser storage is unavailable.
  }
  return null
}

export function saveRequestDraft(key: string, draft: RequestDraft) {
  drafts.set(key, draft)
  try {
    sessionStorage.setItem(
      `${storagePrefix}${key}`,
      JSON.stringify({
        ...draft,
        formDataFields: draft.formDataFields.map((field) => ({
          ...field,
          files: [],
        })),
      }),
    )
  } catch {
    // Retain drafts, including selected files, while navigating in this tab.
  }
}
