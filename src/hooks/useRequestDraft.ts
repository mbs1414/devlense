import { useEffect } from "react"
import { saveRequestDraft, type RequestDraft } from "@/lib/requestDrafts"

export function useRequestDraft(key: string | null, draft: RequestDraft) {
  useEffect(() => {
    if (key) saveRequestDraft(key, draft)
  }, [key, draft])
}
