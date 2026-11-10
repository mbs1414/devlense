export interface RequestResult {
  responseInfo: ResponseInfo | null
  submittedUrl: string
  requestSummary: string
  error: string
  loading: boolean
}

const emptyResult: RequestResult = {
  responseInfo: null,
  submittedUrl: "",
  requestSummary: "",
  error: "",
  loading: false,
}
const results = new Map<string, RequestResult>()
const listeners = new Set<() => void>()
const storagePrefix = "devlens-request-result:"

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isResponse(value: unknown): value is ResponseInfo | null {
  return (
    value === null ||
    (isRecord(value) &&
      typeof value.duration === "number" &&
      typeof value.statusCode === "number" &&
      ["size", "statusLabel", "body"].every(
        (key) => typeof value[key] === "string",
      ) &&
      (value.imageUrl === null ||
        (typeof value.imageUrl === "string" &&
          value.imageUrl.startsWith("data:image/"))))
  )
}

export function readRequestResult(key: string): RequestResult {
  const cached = results.get(key)
  if (cached) return cached
  let result = emptyResult
  try {
    const saved: unknown = JSON.parse(
      sessionStorage.getItem(`${storagePrefix}${key}`) ?? "null",
    )
    if (
      isRecord(saved) &&
      isResponse(saved.responseInfo) &&
      typeof saved.submittedUrl === "string" &&
      typeof saved.requestSummary === "string" &&
      typeof saved.error === "string"
    ) {
      result = {
        responseInfo: saved.responseInfo,
        submittedUrl: saved.submittedUrl,
        requestSummary: saved.requestSummary,
        error: saved.error,
        loading: false,
      }
    }
  } catch {
    // Keep results available in memory when browser storage is unavailable.
  }
  results.set(key, result)
  return result
}

export function updateRequestResult(
  key: string,
  update: (previous: RequestResult) => RequestResult,
) {
  const result = update(readRequestResult(key))
  results.set(key, result)
  try {
    sessionStorage.setItem(
      `${storagePrefix}${key}`,
      JSON.stringify({ ...result, loading: false }),
    )
  } catch {
    // Large responses remain available while navigating in this tab.
  }
  listeners.forEach((listener) => listener())
}

export function subscribeToRequestResults(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
