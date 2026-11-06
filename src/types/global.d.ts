interface ResponseInfo {
  duration: number
  size: string
  statusLabel: string // "200 OK"
  statusCode: number // 200
  body: string
  imageUrl: string | null
}

interface RequestField {
  id: string
  key: string
  value: string
  description: string
  enabled: boolean
}

interface FormDataField extends RequestField {
  type: "text" | "file"
  files: File[]
}

type RequestHistory = {
  id: string
  createdAt: number
  name: string
  collectionName: string
  method: string
  url: string
  statusCode: number | null
  statusLabel: string
  duration: number
  size: string | null
}

type PostmanHeader = {
  key: string
  value: string
  disabled?: boolean
  description?: string
}

type PostmanUrl =
  | string
  | {
      raw?: string
      protocol?: string
      host?: string | string[]
      path?: string | string[]
      port?: string
      query?: PostmanHeader[]
      variable?: PostmanHeader[]
    }

type PostmanBody = {
  mode?: "raw" | "urlencoded" | "formdata" | "file" | "graphql"
  raw?: string
  urlencoded?: PostmanHeader[]
  formdata?: {
    key: string
    value?: string
    type?: "text" | "file"
    src?: string | string[] | null
    disabled?: boolean
    description?: string
  }[]
  file?: {
    src?: string | null
    content?: string
  }
  graphql?: {
    query?: string
    variables?: string
  }
}

type PostmanDescription = string | { content?: string }

type PostmanRequest =
  | string
  | {
      method?: string
      url?: PostmanUrl
      header?: PostmanHeader[] | string
      body?: PostmanBody
      description?: PostmanDescription
      auth?: PostmanAuth
    }

type PostmanResponse = {
  id?: string
  name?: string
  originalRequest?: PostmanRequest
  status?: string
  code?: number
  header?: PostmanHeader[]
  body?: string | null
  cookie?: {
    name?: string
    value?: string
    domain?: string
    path?: string
    expires?: string | number
    httpOnly?: boolean
    secure?: boolean
  }[]
  responseTime?: string | number
  _postman_previewlanguage?: string
}

type PostmanItem = {
  id?: string
  name?: string
  description?: PostmanDescription
  request?: PostmanRequest
  response?: PostmanResponse[]
  item?: PostmanItem[]
}

type PostmanCollection = {
  databaseId?: string
  info: {
    name: string
    schema: string
    _postman_id?: string
    description?: string
  }
  item: PostmanItem[]
  variable?: PostmanVariable[]
  auth?: PostmanAuth
}

type PostmanAuth = {
  type?: string
  bearer?: { key: string; value: unknown }[]
}

type PostmanVariable = {
  key?: string
  value?: unknown
  type?: string
  disabled?: boolean
  description?: PostmanDescription
}

type Environment = {
  id: string
  name: string
  active: boolean
  variables: EnvironmentVariable[]
  kind?: "environment" | "collection"
  collectionId?: string
}

type EnvironmentVariable = {
  id: string
  enabled: boolean
  key: string
  type: "text" | "secret"
  value: string
  description: string
  visible: boolean
}
