import { Folder, Globe, History, Send, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const routes: { name: string; icon: LucideIcon; to: string }[] = [
  { name: "Request", icon: Send, to: "/request" },
  { name: "History", icon: History, to: "/history" },
  { name: "Collections", icon: Folder, to: "/collections" },
  { name: "Environments", icon: Globe, to: "/environments" },
  { name: "Settings", icon: Settings, to: "/settings" },
]
