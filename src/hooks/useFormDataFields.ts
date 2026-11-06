import { useState } from "react"

export function useFormDataFields() {
  const [fields, setFields] = useState<FormDataField[]>([])

  const addField = () => {
    setFields((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        key: "",
        value: "",
        description: "",
        enabled: true,
        type: "text",
        files: [],
      },
    ])
  }

  const removeField = (id: string) => {
    setFields((previous) => previous.filter((field) => field.id !== id))
  }

  const updateField = <K extends keyof Omit<FormDataField, "id">>(
    id: string,
    field: K,
    value: FormDataField[K],
  ) => {
    setFields((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        if (field === "type") updated.files = []
        return updated
      }),
    )
  }

  return { fields, setFields, addField, removeField, updateField }
}
