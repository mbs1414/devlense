interface ResponseInfo {
  duration: number
  size: string
  statusLabel: string // "200 OK"
  statusCode: number // 200
  body: string
}

interface RequestField {
  id: string
  key: string
  value: string
  description: string
  enabled: boolean
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

type PostmanRequest =
  | string
  | {
      method?: string
      url?: PostmanUrl
      header?: PostmanHeader[] | string
      body?: PostmanBody
      description?: string
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
  description?: string
  request?: PostmanRequest
  response?: PostmanResponse[]
  item?: PostmanItem[]
}

type PostmanCollection = {
  info: {
    name: string
    schema: string
    _postman_id?: string
    description?: string
  }
  item: PostmanItem[]
}
