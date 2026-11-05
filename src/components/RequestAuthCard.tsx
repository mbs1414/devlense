import PlaceholderState from "@/components/PlaceholderState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { authTypes } from "@/constants/request"
import type { useRequestAuth } from "@/hooks/useRequestAuth"
import { ShieldOff } from "lucide-react"

type Props = Pick<
  ReturnType<typeof useRequestAuth>,
  "authType" | "setAuthType" | "auth" | "handleAuthChange"
> & { environmentToken?: string }

export default function RequestAuthCard({
  authType,
  setAuthType,
  auth,
  handleAuthChange,
  environmentToken,
}: Props) {
  return (
    <Card className="bg-surface mt-4">
      <CardHeader>
        <CardTitle className="text-section-title font-semibold">
          Auth · Bearer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          size="lg"
          value={authType}
          onValueChange={(value) => value && setAuthType(value)}
          variant="default"
          spacing={1}
          className="mb-4"
        >
          {authTypes.map((auth) => (
            <ToggleGroupItem
              key={auth.value}
              value={auth.value}
              aria-label={auth.label}
              className="bg-action-secondary data-[state=on]:bg-action-primary"
            >
              {auth.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* no auth */}
        {authType === "no auth" && (
          <PlaceholderState
            title="No authentication required"
            description="This request will be sent without authentication credentials."
            icon={ShieldOff}
            variant="inline"
          />
        )}

        {/* Bearer auth */}
        {authType === "bearer" && (
          <Field>
            <FieldLabel
              className="text-label text-color-secondary"
              htmlFor="token"
            >
              Token
            </FieldLabel>
            <Input
              className="font-mono text-color-accent h-11"
              placeholder="{{token}}"
              id="token"
              value={environmentToken || auth.token}
              readOnly={Boolean(environmentToken)}
              onChange={(e) => handleAuthChange("token", e.target.value)}
            />
          </Field>
        )}

        {/* Basic auth */}
        {authType === "basic" && (
          <FieldGroup className="flex flex-row">
            <Field>
              <FieldLabel
                className="text-label text-color-secondary"
                htmlFor="username"
              >
                Username
              </FieldLabel>
              <Input
                id="username"
                className="h-11"
                value={auth.username}
                onChange={(e) => handleAuthChange("username", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel
                className="text-label text-color-secondary"
                htmlFor="password"
              >
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                className="h-11"
                value={auth.password}
                onChange={(e) => handleAuthChange("password", e.target.value)}
              />
            </Field>
          </FieldGroup>
        )}

        {/* API key auth */}
        {authType === "api key" && (
          <>
            <FieldGroup className="flex flex-row">
              <Field>
                <FieldLabel
                  className="text-label text-color-secondary"
                  htmlFor="key"
                >
                  Key
                </FieldLabel>
                <Input
                  id="key"
                  className="h-11"
                  value={auth.apiKeyName}
                  onChange={(e) =>
                    handleAuthChange("apiKeyName", e.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel
                  className="text-label text-color-secondary"
                  htmlFor="value"
                >
                  Value
                </FieldLabel>
                <Input
                  id="value"
                  className="font-mono text-color-accent h-11"
                  value={auth.apiKeyValue}
                  onChange={(e) =>
                    handleAuthChange("apiKeyValue", e.target.value)
                  }
                />
              </Field>
            </FieldGroup>

            <div className="flex items-center gap-2 mt-4 text-color-secondary">
              <span className="shrink-0 text-sm font-medium">Add to:</span>
              <RadioGroup
                defaultValue="header"
                className="flex items-center gap-4"
                value={auth.apiKeyLocation}
                onValueChange={(value) =>
                  (value === "header" || value === "query-params") &&
                  handleAuthChange("apiKeyLocation", value)
                }
              >
                <div className="flex items-center gap-1">
                  <RadioGroupItem id="header" value="header" />
                  <Label htmlFor="header">Header</Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem id="query-params" value="query-params" />
                  <Label htmlFor="query-params" className="whitespace-nowrap">
                    Query Params
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
