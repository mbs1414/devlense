import {
  useMemo,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  readRequestResult,
  subscribeToRequestResults,
  updateRequestResult,
  type RequestResult,
} from "@/lib/requestResults"

export function useRequestResult(key: string) {
  const result = useSyncExternalStore(subscribeToRequestResults, () =>
    readRequestResult(key),
  )
  const setters = useMemo(() => {
    function createSetter<K extends keyof RequestResult>(
      field: K,
    ): Dispatch<SetStateAction<RequestResult[K]>> {
      return (value) =>
        updateRequestResult(key, (previous) => ({
          ...previous,
          [field]: typeof value === "function" ? value(previous[field]) : value,
        }))
    }
    return {
      setResponseInfo: createSetter("responseInfo"),
      setSubmittedUrl: createSetter("submittedUrl"),
      setRequestSummary: createSetter("requestSummary"),
      setError: createSetter("error"),
      setLoading: createSetter("loading"),
    }
  }, [key])
  return { ...result, ...setters }
}
