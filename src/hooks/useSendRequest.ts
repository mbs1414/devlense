import { useCallback, useState } from "react"
import { getReasonPhrase } from "http-status-codes"
import type { RequestAuth } from "@/hooks/useRequestAuth"
import { resolveVariables } from "@/lib/resolveVariables"
import { toast } from "sonner"

interface Options {
  method: string
  request: string
  requestBody: string
  bodyType: string
  queryParams: RequestField[]
  headers: RequestField[]
  authType: string
  auth: RequestAuth
  variables: EnvironmentVariable[]
  variablesReady: boolean
}

const getStatusLabel = (code: number): string => {
  try {
    return getReasonPhrase(code)
  } catch {
    return "Unknown Status"
  }
}

export function useSendRequest({
  method,
  request,
  requestBody,
  bodyType,
  queryParams,
  headers,
  authType,
  auth,
  variables,
  variablesReady,
}: Options) {
  const [responseInfo, setResponseInfo] = useState<ResponseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [submittedUrl, setSubmittedUrl] = useState("")
  const [requestSummary, setRequestSummary] = useState("")

  const sendRequest = useCallback(async () => {
    if (!variablesReady) {
      toast.error("Environments are not ready. Try again after they load.")
      return
    }
    setLoading(true)
    setResponseInfo(null)

    const startTime = performance.now()
    try {
      const resolve = (value: string) => resolveVariables(value, variables)
      const url = new URL(resolve(request))
      const requestHeaders = new Headers()

      queryParams
        .filter((param) => param.enabled && param.key.trim())
        .forEach((param) => {
          url.searchParams.append(resolve(param.key), resolve(param.value))
        })

      headers
        .filter((header) => header.enabled && header.key.trim())
        .forEach((header) => {
          requestHeaders.append(
            resolve(header.key).trim(),
            resolve(header.value),
          )
        })

      switch (authType) {
        case "bearer":
          requestHeaders.set(
            "Authorization",
            `Bearer ${resolve(auth.token).trim()}`,
          )
          break

        case "basic": {
          const credentials = `${resolve(auth.username)}:${resolve(auth.password)}`
          const bytes = new TextEncoder().encode(credentials)
          const encoded = btoa(
            Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""),
          )

          requestHeaders.set("Authorization", `Basic ${encoded}`)
          break
        }

        case "api key": {
          const key = resolve(auth.apiKeyName).trim()

          if (!key) {
            throw new Error("API key name is required")
          }

          if (auth.apiKeyLocation === "header") {
            requestHeaders.set(key, resolve(auth.apiKeyValue))
          } else {
            url.searchParams.set(key, resolve(auth.apiKeyValue))
          }

          break
        }

        case "no auth":
          break
      }

      const canSendBody =
        method !== "GET" && method !== "HEAD" && bodyType !== "none"
      const resolvedBody = canSendBody ? resolve(requestBody) : ""

      if (canSendBody && !requestHeaders.has("Content-Type")) {
        requestHeaders.set(
          "Content-Type",
          bodyType === "json" ? "application/json" : "text/plain",
        )
      }

      setSubmittedUrl(url.toString())
      const paramCount = url.searchParams.size
      const headerCount = Array.from(requestHeaders.keys()).length
      const bodyLabel =
        canSendBody && resolvedBody.length > 0
          ? "Request body"
          : "No request body"
      const authorization = requestHeaders.get("Authorization") ?? ""
      const authLabel = /^Bearer\s+\S+/i.test(authorization)
        ? "Bearer auth"
        : /^Basic\s+\S+/i.test(authorization)
          ? "Basic auth"
          : authorization
            ? "Authorization header"
            : "No auth"

      setRequestSummary(
        `${paramCount} query parameters · ${headerCount} headers · ${bodyLabel} · ${authLabel}`,
      )
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        ...(canSendBody ? { body: resolvedBody } : {}),
      })
      const body = await response.text()

      setResponseInfo({
        duration: Math.round(performance.now() - startTime),
        size: (new Blob([body]).size / 1024).toFixed(2),
        statusLabel: `${response.status} ${getStatusLabel(response.status)}`,
        statusCode: response.status,
        body,
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send request",
      )
    } finally {
      setLoading(false)
    }
  }, [
    method,
    request,
    requestBody,
    bodyType,
    queryParams,
    headers,
    authType,
    auth,
    variables,
    variablesReady,
  ])

  return {
    sendRequest,
    responseInfo,
    setResponseInfo,
    loading,
    submittedUrl,
    requestSummary,
  }
}
