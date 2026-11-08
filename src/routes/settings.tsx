import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { createFileRoute } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import { useSettings } from "@/hooks/useSettings"

export const Route = createFileRoute("/settings")({
  component: function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const { settings, updateSetting, error } = useSettings()
    const themeTypes = [
      {
        value: "dark",
        label: "Dark",
      },
      {
        value: "light",
        label: "Light",
      },
      {
        value: "system",
        label: "System",
      },
    ]
    const timeoutOptions = [
      { label: "30 seconds", value: "30" },
      { label: "45 seconds", value: "45" },
      { label: "60 seconds", value: "60" },
    ]

    const selectedTimeoutOption = timeoutOptions.find(
      (option) => option.value === String(settings.requestTimeout),
    )
    return (
      <div className="h-full w-full min-w-0 flex flex-col">
        <h1 className="hidden md:block text-color-primary font-semibold text-page-title mb-4">
          Settings
        </h1>

        <Card className="flex-1 bg-surface">
          <CardContent>
            {error && (
              <p
                role="alert"
                className="text-caption text-status-error-fg mb-4"
              >
                {error}
              </p>
            )}
            <section>
              <h1 className="font-semibold mb-4 text-base">Appearance</h1>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-body ">Theme</h2>
                  <p className="text-color-secondary text-label">
                    Use Dark, Light, or follow the system appearance.
                  </p>
                </div>
                <ToggleGroup
                  type="single"
                  size="lg"
                  value={theme}
                  onValueChange={(value) => {
                    if (value) setTheme(value)
                  }}
                  variant="default"
                  spacing={1}
                  className="w-full md:w-48 shrink-0"
                >
                  {themeTypes.map((bodyType) => (
                    <ToggleGroupItem
                      key={bodyType.value}
                      value={bodyType.value}
                      aria-label={bodyType.label}
                      className="h-11 flex-1 bg-action-secondary data-[state=on]:bg-action-primary"
                    >
                      {bodyType.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </section>

            <Separator className="my-4" />

            <section>
              <h1 className="font-semibold mb-4 text-base">Request defaults</h1>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-body ">Request timeout</h2>
                  <p className="text-color-secondary text-label">
                    Stop requests that exceed this duration.
                  </p>
                </div>
                <Select
                  value={String(settings.requestTimeout)}
                  onValueChange={(value) =>
                    updateSetting("requestTimeout", Number(value))
                  }
                >
                  <SelectTrigger
                    className="h-11 w-full md:w-48 shrink-0"
                    aria-label="Request timeout"
                  >
                    <SelectValue>
                      <span>{selectedTimeoutOption?.label}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {timeoutOptions.map((option) => (
                        <SelectItem
                          value={option.value}
                          className="focus:bg-hover"
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between my-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-body ">Follow redirects</h2>
                  <p className="text-color-secondary text-label">
                    Automatically follow HTTP redirects.
                  </p>
                </div>
                <Button
                  className="h-11 w-full md:w-48 shrink-0"
                  variant="secondary"
                  aria-label="Follow redirects"
                  aria-pressed={settings.followRedirects}
                  onClick={() =>
                    updateSetting("followRedirects", !settings.followRedirects)
                  }
                >
                  {settings.followRedirects ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </section>

            <Separator className="my-4" />

            <section>
              <h1 className="font-semibold mb-4 text-base">
                Editor preferences
              </h1>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between my-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-body ">Word wrap</h2>
                  <p className="text-color-secondary text-label">
                    Wrap long JSON and text values in editors.
                  </p>
                </div>
                <Button
                  className="h-11 w-full md:w-48 shrink-0"
                  variant="secondary"
                  aria-label="Word wrap"
                  aria-pressed={settings.wordWrap}
                  onClick={() => updateSetting("wordWrap", !settings.wordWrap)}
                >
                  {settings.wordWrap ? "On" : "Off"}
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    )
  },
})
