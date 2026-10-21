export const methods = [
  { value: "GET", className: "text-method-get-fg" },
  { value: "POST", className: "text-method-post-fg" },
  { value: "PUT", className: "text-method-put-fg" },
  { value: "PATCH", className: "text-method-patch-fg" },
  { value: "DELETE", className: "text-method-delete-fg" },
]

export const tabs = [
  { value: "params", label: "Params" },
  { value: "headers", label: "Headers" },
  { value: "body", label: "Body" },
  { value: "auth", label: "Auth" },
]

export const bodyTypes = [
  { value: "none", label: "None" },
  { value: "json", label: "JSON" },
  { value: "text", label: "Text" },
]

export const responseTypes = [
  { value: "body", label: "Body" },
  { value: "headers", label: "Headers" },
  { value: "pretty", label: "Pretty" },
  { value: "raw", label: "Raw" },
]

export const authTypes = [
  { value: "no auth", label: "No Auth" },
  { value: "bearer", label: "Bearer" },
  { value: "basic", label: "Basic" },
  { value: "api key", label: "API Key" },
]
