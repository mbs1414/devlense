export function getRequestDetails(item: PostmanItem) {
  const request = typeof item.request === "string" ? null : item.request
  const url = typeof item.request === "string" ? item.request : request?.url
  const rawUrl = typeof url === "string" ? url : (url?.raw ?? "")
  const queryParams: PostmanHeader[] =
    typeof url === "object" && url?.query
      ? url.query
      : Array.from(
          new URLSearchParams(rawUrl.match(/\?([^#]*)/)?.[1] ?? ""),
          ([key, value]) => ({ key, value }),
        )
  const headers = Array.isArray(request?.header) ? request.header : []
  const body = request?.body
  let bodyFields: PostmanHeader[] = []
  let bodyText = ""

  switch (body?.mode) {
    case "raw":
      bodyText = body.raw ?? ""
      break
    case "urlencoded":
      bodyFields = body.urlencoded ?? []
      break
    case "formdata":
      bodyFields = (body.formdata ?? []).map((field) => ({
        ...field,
        value:
          field.type === "file"
            ? [field.src].flat().filter(Boolean).join(", ")
            : (field.value ?? ""),
      }))
      break
    case "graphql":
      bodyText = [body.graphql?.query, body.graphql?.variables]
        .filter(Boolean)
        .join("\n\n")
      break
    case "file":
      bodyText = body.file?.content ?? body.file?.src ?? ""
      break
  }

  return {
    name: item.name || "Untitled request",
    method: request?.method ?? "GET",
    rawUrl,
    queryParams: queryParams.filter((field) => !field.disabled),
    headers: headers.filter((field) => !field.disabled),
    headerText: typeof request?.header === "string" ? request.header : "",
    bodyFields: bodyFields.filter((field) => !field.disabled),
    bodyText,
  }
}
