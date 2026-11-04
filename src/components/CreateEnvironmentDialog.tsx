import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => void
}

export function CreateEnvironmentDialog({
  open,
  onOpenChange,
  onCreate,
}: Props) {
  const [name, setName] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    onCreate(trimmedName)
    setName("")
    onOpenChange(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      setName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create environment</DialogTitle>
            <DialogDescription>
              Create a new environment for your API variables.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-2">
            <Label htmlFor="environment-name">Environment name</Label>

            <Input
              id="environment-name"
              placeholder="e.g. Production"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" size="lg" disabled={!name.trim()}>
              Create environment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
