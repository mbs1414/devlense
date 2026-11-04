import { useState } from "react"
import { Pencil, Trash2, Layers, Check, X, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PlaceholderState from "./PlaceholderState"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  environments: Environment[]
  activeEnvironmentId: string
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function ManageEnvironmentsDialog({
  open,
  onOpenChange,
  environments,
  activeEnvironmentId,
  onRename,
  onDelete,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [name, setName] = useState("")

  const reset = () => {
    setEditingId(null)
    setDeletingId(null)
    setName("")
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  const startRename = (environment: Environment) => {
    setEditingId(environment.id)
    setDeletingId(null)
    setName(environment.name)
  }

  const saveRename = () => {
    if (!editingId || !name.trim()) return

    onRename(editingId, name.trim())
    setEditingId(null)
    setName("")
  }

  const confirmDelete = (id: string) => {
    onDelete(id)
    setDeletingId(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage environments</DialogTitle>
          <DialogDescription>
            Rename or delete your existing environments.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-2 overflow-y-auto py-4">
          {environments.length === 0 ? (
            <PlaceholderState
              variant="inline"
              icon={Layers}
              showBorder={false}
              title="No environments yet"
              description="Create an environment to start managing your API variables."
            />
          ) : (
            environments.map((environment) => {
              const isDeleting = deletingId === environment.id
              const isEditing = editingId === environment.id

              return (
                <div
                  key={environment.id}
                  className={`
        rounded-lg border p-3 transition-colors duration-150
        ${
          isDeleting
            ? "border-destructive/30 bg-destructive/5"
            : "border-border-subtle hover:bg-muted/30"
        }
      `}
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0 text-destructive" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          Delete {environment.name}?
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cannot be undone
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingId(null)}
                      >
                        Keep
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => confirmDelete(environment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Layers className="size-4 shrink-0 text-muted-foreground" />

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <Input
                            autoFocus
                            value={name}
                            maxLength={100}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                saveRename()
                              }
                              if (e.key === "Escape") {
                                e.stopPropagation()
                                setEditingId(null)
                              }
                            }}
                            className="h-8"
                          />
                        ) : (
                          <>
                            <p className="truncate text-sm font-medium">
                              {environment.name}
                            </p>
                            {activeEnvironmentId === environment.id && (
                              <p className="text-xs text-muted-foreground">
                                Active
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      {isEditing ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={!name.trim()}
                            onClick={saveRename}
                            aria-label="Save name"
                          >
                            <Check className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            aria-label="Cancel rename"
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startRename(environment)}
                            aria-label={`Rename ${environment.name}`}
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(null)
                              setDeletingId(environment.id)
                            }}
                            aria-label={`Delete ${environment.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            size="lg"
            onClick={() => handleOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
