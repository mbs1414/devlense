import { useEffect, useState } from "react"

interface Settings {
  requestTimeout: number
  followRedirects: boolean
  wordWrap: boolean
}

const storageKey = "devlens-settings"
const defaultSettings: Settings = {
  requestTimeout: 30,
  followRedirects: true,
  wordWrap: true,
}

function readSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}")
    return {
      requestTimeout: [30, 45, 60].includes(saved?.requestTimeout)
        ? saved.requestTimeout
        : 30,
      followRedirects:
        typeof saved?.followRedirects === "boolean"
          ? saved.followRedirects
          : true,
      wordWrap: typeof saved?.wordWrap === "boolean" ? saved.wordWrap : true,
    }
  } catch {
    return defaultSettings
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(readSettings)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleChange = () => setSettings(readSettings())
    window.addEventListener("storage", handleChange)
    window.addEventListener("devlens-settings-change", handleChange)
    return () => {
      window.removeEventListener("storage", handleChange)
      window.removeEventListener("devlens-settings-change", handleChange)
    }
  }, [])

  const updateSetting = <K extends keyof Settings>(
    field: K,
    value: Settings[K],
  ) => {
    try {
      const updated = { ...readSettings(), [field]: value }
      localStorage.setItem(storageKey, JSON.stringify(updated))
      setSettings(updated)
      setError("")
      window.dispatchEvent(new Event("devlens-settings-change"))
    } catch {
      setError(
        "Unable to save settings. Check that browser storage is available.",
      )
    }
  }

  return { settings, updateSetting, error }
}
