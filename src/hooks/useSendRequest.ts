import { useCallback, useEffect, useState } from "react"
import { getReasonPhrase } from "http-status-codes"
import type { RequestAuth } from "@/hooks/useRequestAuth"
import { resolveVariables } from "@/lib/resolveVariables"
import { useHistory } from "@/hooks/useHistory"
import { useSettings } from "@/hooks/useSettings"

interface Options {
  method: string
  request: string
  requestBody: string
  bodyType: string
  encodedBodyFields: RequestField[]
  formDataFields: FormDataField[]
  queryParams: RequestField[]
  headers: RequestField[]
  authType: string
  auth: RequestAuth
  variables: EnvironmentVariable[]
  variablesReady: boolean
  requestName: string
  collectionName: string
  environmentBearerToken?: string
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
  encodedBodyFields,
  formDataFields,
  queryParams,
  headers,
  authType,
  auth,
  variables,
  variablesReady,
  requestName,
  collectionName,
  environmentBearerToken = "",
}: Options) {
  const [responseInfo, setResponseInfo] = useState<ResponseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [submittedUrl, setSubmittedUrl] = useState("")
  const [requestSummary, setRequestSummary] = useState("")
  const [error, setError] = useState("")
  const { saveHistoryToIndexedDB } = useHistory()
  const { settings } = useSettings()

  const imageUrl = responseInfo?.imageUrl
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const sendRequest = useCallback(async () => {
    setError("")
    if (!variablesReady) {
      setError("Environments are not ready. Try again after they load.")
      return
    }
    setLoading(true)
    setResponseInfo(null)

    const startTime = performance.now()
    let historyEntry: RequestHistory | null = null
    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    try {
      const resolve = (value: string) => resolveVariables(value, variables)
      const url = new URL(resolve(request))
      const requestHeaders = new Headers()
      const canSendBody =
        method !== "GET" && method !== "HEAD" && bodyType !== "none"

      queryParams
        .filter((param) => param.enabled && param.key.trim())
        .forEach((param) => {
          url.searchParams.append(resolve(param.key), resolve(param.value))
        })

      headers
        .filter((header) => header.enabled && header.key.trim())
        .forEach((header) => {
          const key = resolve(header.key).trim()
          if (
            canSendBody &&
            bodyType === "formdata" &&
            key.toLowerCase() === "content-type"
          )
            return
          if (authType === "bearer" && key.toLowerCase() === "authorization")
            return
          requestHeaders.append(key, resolve(header.value))
        })

      switch (authType) {
        case "bearer":
          requestHeaders.set(
            "Authorization",
            `Bearer ${resolve(environmentBearerToken.trim() || auth.token).trim()}`,
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

      let resolvedBody: string | FormData = ""

      if (canSendBody) {
        if (bodyType === "formdata") {
          const body = new FormData()
          formDataFields
            .filter((field) => field.enabled && field.key.trim())
            .forEach((field) => {
              const key = resolve(field.key)
              if (field.type === "file") {
                if (field.files.length === 0)
                  throw new Error(`Choose a file for "${key}" before sending.`)
                field.files.forEach((file) => body.append(key, file))
              } else {
                body.append(key, resolve(field.value))
              }
            })
          resolvedBody = body
        } else if (bodyType === "encoded") {
          const body = new URLSearchParams()

          encodedBodyFields
            .filter((field) => field.enabled && field.key.trim())
            .forEach((field) =>
              body.append(resolve(field.key), resolve(field.value)),
            )

          resolvedBody = body.toString()
        } else {
          resolvedBody = resolve(requestBody)
        }
      }

      if (
        canSendBody &&
        bodyType !== "formdata" &&
        !requestHeaders.has("Content-Type")
      ) {
        let contentType = "text/plain"
        if (bodyType === "json") contentType = "application/json"
        if (bodyType === "encoded")
          contentType = "application/x-www-form-urlencoded"
        requestHeaders.set("Content-Type", contentType)
      }

      setSubmittedUrl(url.toString())
      const paramCount = url.searchParams.size
      const headerCount = Array.from(requestHeaders.keys()).length
      const bodyLabel =
        canSendBody &&
        (typeof resolvedBody === "string"
          ? resolvedBody.length > 0
          : Array.from(resolvedBody.keys()).length > 0)
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
      historyEntry = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        name: requestName,
        collectionName,
        method,
        url: request,
        statusCode: null,
        statusLabel: "Request failed",
        duration: 0,
        size: null,
      }
      timeoutId = setTimeout(
        () => controller.abort(),
        settings.requestTimeout * 1000,
      )
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        redirect: settings.followRedirects ? "follow" : "error",
        headers: requestHeaders,
        ...(canSendBody ? { body: resolvedBody } : {}),
      })
      const blob = await response.blob()
      const isImage = blob.type.startsWith("image/")
      const body = isImage ? "" : await blob.text()

      const responseDetails = {
        duration: Math.round(performance.now() - startTime),
        size: (blob.size / 1024).toFixed(2),
        statusLabel: `${response.status} ${getStatusLabel(response.status)}`,
        statusCode: response.status,
        body,
        imageUrl: isImage ? URL.createObjectURL(blob) : null,
      }

      setResponseInfo(responseDetails)
      historyEntry.statusCode = responseDetails.statusCode
      historyEntry.statusLabel = responseDetails.statusLabel
      historyEntry.size = responseDetails.size
    } catch (error) {
      if (controller.signal.aborted) {
        setError(`Request timed out after ${settings.requestTimeout} seconds.`)
        if (historyEntry) historyEntry.statusLabel = "Timed out"
      } else {
        setError(
          error instanceof Error ? error.message : "Unable to send request",
        )
      }
    } finally {
      clearTimeout(timeoutId)
      if (historyEntry) {
        historyEntry.duration = Math.round(performance.now() - startTime)

        try {
          await saveHistoryToIndexedDB(historyEntry)
        } catch {
          setError((previous) =>
            previous
              ? `${previous} Unable to save request history.`
              : "Unable to save request history.",
          )
        }
      }
      setLoading(false)
    }
  }, [
    method,
    request,
    requestBody,
    bodyType,
    encodedBodyFields,
    formDataFields,
    queryParams,
    headers,
    authType,
    auth,
    variables,
    variablesReady,
    requestName,
    collectionName,
    saveHistoryToIndexedDB,
    environmentBearerToken,
    settings.requestTimeout,
    settings.followRedirects,
  ])

  return {
    sendRequest,
    responseInfo,
    setResponseInfo,
    loading,
    submittedUrl,
    requestSummary,
    error,
    setError,
  }
}
