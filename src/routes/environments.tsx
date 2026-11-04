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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEnvironments } from "@/hooks/useEnvironments"
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

export const Route = createFileRoute("/environments")({
  component: function EnvironmentsPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [manageDialogOpen, setManageDialogOpen] = useState(false)
    const [search, setSearch] = useState("")
    const { environments, setEnvironments, isLoadingEnvironments, hasLoaded } =
      useEnvironments()
    const activeEnvironment = environments.find(
      (environment) => environment.active,
    )
    const activeEnvironmentId = activeEnvironment?.id ?? ""
    const variables = activeEnvironment?.variables ?? []
    const userEnvironments = environments.filter(
      (environment) => environment.kind !== "collection",
    )
    const collectionEnvironments = environments.filter(
      (environment) => environment.kind === "collection",
    )

    const setActiveEnvironmentId = (id: string) => {
      setEnvironments((previous) =>
        previous.map((environment) => ({
          ...environment,
          active: environment.id === id,
        })),
      )
    }

    const setVariables = (
      update: (previous: EnvironmentVariable[]) => EnvironmentVariable[],
    ) => {
      setEnvironments((previous) =>
        previous.map((environment) =>
          environment.id === activeEnvironmentId
            ? { ...environment, variables: update(environment.variables) }
            : environment,
        ),
      )
    }

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

    const updateVariable = <K extends keyof Omit<EnvironmentVariable, "id">>(
      id: string,
      field: K,
      value: EnvironmentVariable[K],
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
        kind: "environment",
        active: true,
        variables: [],
      }

      setEnvironments((previous) => [
        ...previous.map((environment) => ({ ...environment, active: false })),
        newEnvironment,
      ])
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

      // Switch selection if the active environment was deleted.
      if (activeEnvironmentId === id) {
        setEnvironments(
          remaining.map((environment, index) => ({
            ...environment,
            active: index === 0,
          })),
        )
      } else {
        setEnvironments(remaining)
      }
    }

    return (
      <div className="flex min-h-[calc(100dvh-48px)] flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-color-primary font-semibold text-page-title">
              Environments
            </h1>
            <p className="text-color-secondary text-body mt-1">
              Reusable values for your API requests.
            </p>
          </div>

          <Button
            onClick={() => setCreateDialogOpen(true)}
            disabled={!hasLoaded}
          >
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
            value={activeEnvironmentId}
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
              {userEnvironments.length > 0 && (
                <SelectGroup>
                  <SelectLabel>My environments</SelectLabel>
                  {userEnvironments.map((environment) => (
                    <SelectItem key={environment.id} value={environment.id}>
                      {environment.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {collectionEnvironments.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Collection variables</SelectLabel>
                  {collectionEnvironments.map((environment) => (
                    <SelectItem key={environment.id} value={environment.id}>
                      {environment.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>

          <Button
            variant="softOutline"
            size="icon"
            aria-label="Manage environments"
            title="Manage environments"
            onClick={() => setManageDialogOpen(true)}
            disabled={!hasLoaded}
          >
            <Settings2 className="size-4" />
          </Button>

          <ManageEnvironmentsDialog
            open={manageDialogOpen}
            onOpenChange={setManageDialogOpen}
            environments={userEnvironments}
            activeEnvironmentId={activeEnvironmentId}
            onRename={handleRenameEnvironment}
            onDelete={handleDeleteEnvironment}
          />
        </div>

        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0 bg-surface py-0">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle p-4 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-section-title text-color-primary">
                {activeEnvironment?.kind === "collection"
                  ? "Collection variables"
                  : "Variables"}
              </h2>
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
              <Button
                variant="secondary"
                size="lg"
                onClick={addVariable}
                disabled={!activeEnvironment}
              >
                <Plus className="size-4" />
                Add variable
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-80 flex-1 flex-col overflow-hidden p-4">
            <div className="flex h-full min-h-0 flex-col">
              {isLoadingEnvironments ? (
                <p className="text-color-secondary">Loading environments...</p>
              ) : !hasLoaded ? (
                <p className="text-color-secondary">
                  Unable to load environments. Refresh to try again.
                </p>
              ) : filteredVariables.length === 0 ? (
                <PlaceholderState
                  variant="inline"
                  showBorder={false}
                  icon={search.trim() ? SearchX : FilePlus2}
                  title={
                    !activeEnvironment
                      ? "No environment selected"
                      : search.trim()
                        ? "No matching variables"
                        : "No variables yet"
                  }
                  description={
                    !activeEnvironment
                      ? "Create an environment to add variables."
                      : search.trim()
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
            <p className="text-caption text-color-muted">
              {hasLoaded ? "Changes are saved automatically." : ""}
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  },
})
