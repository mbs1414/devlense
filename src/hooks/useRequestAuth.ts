import { useState } from "react"

export interface RequestAuth {
  token: string
  username: string
  password: string
  apiKeyName: string
  apiKeyValue: string
  apiKeyLocation: "header" | "query-params"
}

export function useRequestAuth() {
  const [authType, setAuthType] = useState("no auth")
  const [auth, setAuth] = useState<RequestAuth>({
    token: "",
    username: "",
    password: "",
    apiKeyName: "",
    apiKeyValue: "",
    apiKeyLocation: "header" as "header" | "query-params",
  })

  const handleAuthChange = <K extends keyof typeof auth>(
    field: K,
    value: (typeof auth)[K],
  ) => {
    setAuth((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  return { authType, setAuthType, auth, setAuth, handleAuthChange }
}
