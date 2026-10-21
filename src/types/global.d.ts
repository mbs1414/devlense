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
