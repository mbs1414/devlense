import { useState } from "react"

export function useRequestFields() {
  const [fields, setFields] = useState<RequestField[]>([])
  const addField = () => {
    setFields((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        description: "",
        enabled: true,
      },
    ])
  }

  const removeField = (fieldId: string) => {
    setFields((previous) => previous.filter((field) => field.id !== fieldId))
  }

  const updateField = <K extends keyof Omit<RequestField, "id">>(
    id: string,
    field: K,
    value: RequestField[K],
  ) => {
    setFields((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    )
  }

  return { fields, setFields, addField, removeField, updateField }
}
