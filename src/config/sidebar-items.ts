import { Folder, Globe, History, Send, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const routes: { name: string; icon: LucideIcon }[] = [
  { name: "Request", icon: Send },
  { name: "History", icon: History },
  { name: "Collections", icon: Folder },
  { name: "Environments", icon: Globe },
  { name: "Settings", icon: Settings },
]
