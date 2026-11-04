import { CreateEnvironmentDialog } from "@/components/CreateEnvironmentDialog"
import { ManageEnvironmentsDialog } from "@/components/ManageEnvironmentsDialog"
import PlaceholderState from "@/components/PlaceholderState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createFileRoute } from "@tanstack/react-router"
import {
  Eye,
  EyeOff,
  FilePlus2,
  Plus,
  Search,
  SearchX,
  Settings2,
  Trash2,
} from "lucide-react"
import { useState } from "react"

type Variable = {
  id: string
  enabled: boolean
  key: string
  type: "text" | "secret"
  value: string
  description: string
  visible: boolean
}

export const Route = createFileRoute("/environments")({
  component: function EnvironmentsPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [manageDialogOpen, setManageDialogOpen] = useState(false)
    const [variables, setVariables] = useState<Variable[]>([])
    const [search, setSearch] = useState("")

    const addVariable = () => {
      setSearch("")
      setVariables((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          enabled: true,
          key: "",
          type: "text",
          value: "",
          description: "",
          visible: false,
        },
      ])
    }

    const [environments, setEnvironments] = useState<Environment[]>([
      { id: "development", name: "Development" },
    ])

    const [activeEnvironmentId, setActiveEnvironmentId] =
      useState("development")

    const updateVariable = <K extends keyof Omit<Variable, "id">>(
      id: string,
      field: K,
      value: Variable[K],
    ) => {
      setVariables((previous) =>
        previous.map((variable) =>
          variable.id === id ? { ...variable, [field]: value } : variable,
        ),
      )
    }

    const removeVariable = (id: string) => {
      setVariables((previous) =>
        previous.filter((variable) => variable.id !== id),
      )
    }

    const filteredVariables = variables.filter((variable) =>
      variable.key.toLowerCase().includes(search.trim().toLowerCase()),
    )

    const handleCreateEnvironment = (name: string) => {
      const newEnvironment: Environment = {
        id: crypto.randomUUID(),
        name,
      }

      setEnvironments((previous) => [...previous, newEnvironment])

      setActiveEnvironmentId(newEnvironment.id)
    }

    const handleRenameEnvironment = (id: string, name: string) => {
      setEnvironments((previous) =>
        previous.map((environment) =>
          environment.id === id ? { ...environment, name } : environment,
        ),
      )
    }

    const handleDeleteEnvironment = (id: string) => {
      const remaining = environments.filter(
        (environment) => environment.id !== id,
      )

      setEnvironments(remaining)

      // Switch selection if the active environment was deleted.
      if (activeEnvironmentId === id) {
        setActiveEnvironmentId(remaining[0]?.id ?? "")
      }
    }

    return (
      <div className="flex h-[calc(100dvh-48px)] min-h-0 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-color-primary font-semibold text-page-title">
              Environments
            </h1>
            <p className="text-color-secondary text-body mt-1">
              Reusable values for your API requests.
            </p>
          </div>

          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="size-4" />
            New environment
          </Button>

          <CreateEnvironmentDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onCreate={handleCreateEnvironment}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 my-4">
          <Select
            value={activeEnvironmentId || undefined}
            onValueChange={setActiveEnvironmentId}
            disabled={environments.length === 0}
          >
            <SelectTrigger aria-label="Environment" className="min-w-48">
              <SelectValue
                placeholder={
                  environments.length === 0
                    ? "No environments"
                    : "Select environment"
                }
              />
            </SelectTrigger>

            <SelectContent position="popper">
              {environments.map((environment) => (
                <SelectItem key={environment.id} value={environment.id}>
                  {environment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <span className="inline-flex items-center gap-2 rounded-full bg-status-success-fg/10 px-2.5 py-1 text-caption font-medium text-status-success-fg">
              <span className="size-2 rounded-full bg-status-success-fg" />
              Active
            </span> */}

          <Button
            variant="softOutline"
            size="icon"
            aria-label="Manage environments"
            title="Manage environments"
            onClick={() => setManageDialogOpen(true)}
          >
            <Settings2 className="size-4" />
          </Button>

          <ManageEnvironmentsDialog
            open={manageDialogOpen}
            onOpenChange={setManageDialogOpen}
            environments={environments}
            activeEnvironmentId={activeEnvironmentId}
            onRename={handleRenameEnvironment}
            onDelete={handleDeleteEnvironment}
          />
        </div>

        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0 bg-surface py-0">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle p-4 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-section-title text-color-primary">
                Variables
              </h2>
              {/* <span className="rounded-full bg-surface-subtle px-2 py-1 text-caption text-color-muted">
                  {variables.length} variables
                </span> */}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <InputGroup className="w-48 border-border">
                <InputGroupInput
                  aria-label="Search variables"
                  placeholder="Search variables"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <InputGroupAddon align="inline-start">
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <Button variant="secondary" size="lg" onClick={addVariable}>
                <Plus className="size-4" />
                Add variable
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
            <div className="flex h-full min-h-0 flex-col">
              {filteredVariables.length === 0 ? (
                <PlaceholderState
                  variant="inline"
                  showBorder={false}
                  icon={search.trim() ? SearchX : FilePlus2}
                  title={
                    search.trim() ? "No matching variables" : "No variables yet"
                  }
                  description={
                    search.trim()
                      ? "Try a different search term."
                      : "Click Add variable to create your first variable."
                  }
                />
              ) : (
                <>
                  <div className="grid grid-cols-[20px_minmax(0,1fr)_120px_minmax(0,1.4fr)_minmax(0,1fr)_72px] gap-2 items-center px-2 pb-2 text-caption text-color-muted">
                    <div />
                    <div>Variable</div>
                    <div>Type</div>
                    <div>Value</div>
                    <div>Description</div>
                    <div />
                  </div>
                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
                    {filteredVariables.map((variable) => (
                      <div
                        key={variable.id}
                        className="grid grid-cols-[20px_minmax(0,1fr)_120px_minmax(0,1.4fr)_minmax(0,1fr)_72px] gap-2 items-center p-2 bg-surface-subtle border border-border-subtle rounded-md"
                      >
                        <Checkbox
                          aria-label="Enable variable"
                          checked={variable.enabled}
                          onCheckedChange={(checked) =>
                            updateVariable(
                              variable.id,
                              "enabled",
                              checked === true,
                            )
                          }
                        />
                        <Input
                          aria-label="Variable name"
                          className="font-mono"
                          placeholder="baseUrl"
                          value={variable.key}
                          onChange={(event) =>
                            updateVariable(
                              variable.id,
                              "key",
                              event.target.value,
                            )
                          }
                        />
                        <Select
                          value={variable.type}
                          onValueChange={(value: "text" | "secret") =>
                            updateVariable(variable.id, "type", value)
                          }
                        >
                          <SelectTrigger
                            aria-label="Variable type"
                            className="w-full h-8!"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="secret">Secret</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          aria-label="Variable value"
                          className="font-mono"
                          type={
                            variable.type === "secret" && !variable.visible
                              ? "password"
                              : "text"
                          }
                          placeholder="Value"
                          value={variable.value}
                          onChange={(event) =>
                            updateVariable(
                              variable.id,
                              "value",
                              event.target.value,
                            )
                          }
                        />
                        <Input
                          aria-label="Variable description"
                          placeholder="Description"
                          value={variable.description}
                          onChange={(event) =>
                            updateVariable(
                              variable.id,
                              "description",
                              event.target.value,
                            )
                          }
                        />
                        <div className="flex items-center gap-1">
                          {variable.type === "secret" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={
                                variable.visible ? "Hide value" : "Show value"
                              }
                              onClick={() =>
                                updateVariable(
                                  variable.id,
                                  "visible",
                                  !variable.visible,
                                )
                              }
                            >
                              {variable.visible ? <EyeOff /> : <Eye />}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete variable"
                            onClick={() => removeVariable(variable.id)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2 border-border-subtle shrink-0">
            {/* <span className="mr-auto rounded-full bg-surface-subtle px-2 py-1 text-caption text-color-muted">
                {variables.filter((variable) => variable.enabled).length} enabled
              </span>
              <span className="rounded-full bg-status-warning-fg/10 px-2 py-1 text-caption text-status-warning-fg">
                Unsaved changes
              </span> */}
            <Button variant="secondary" size="lg" disabled>
              Discard
            </Button>
            <Button size="lg" disabled>
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  },
})
