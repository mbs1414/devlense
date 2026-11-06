import { Button } from "@/components/ui/button"
import RequestUrlInput from "@/components/RequestUrlInput"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { methods } from "@/constants/request"
import { Loader2Icon } from "lucide-react"

interface Props {
  method: string
  request: string
  setMethod: (method: string) => void
  setRequest: (request: string) => void
  sendRequest: () => Promise<void>
  loading: boolean
  disabled?: boolean
  variables: EnvironmentVariable[]
}

export default function RequestBar({
  method,
  setMethod,
  request,
  setRequest,
  sendRequest,
  loading,
  disabled,
  variables,
}: Props) {
  const selectedMethod = methods.find((item) => item.value === method)
  return (
    <div className="flex min-w-0 gap-2 my-4 items-center">
      <Select value={method} onValueChange={setMethod}>
        <SelectTrigger className="w-28 shrink-0">
          <SelectValue>
            <span className={`${selectedMethod?.className} font-mono w-14`}>
              {method}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {methods.map((method) => (
              <SelectItem
                value={method.value}
                className={`${method.className} focus:bg-hover`}
                key={method.value}
              >
                {method.value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex min-w-0 flex-1">
        <RequestUrlInput
          value={request}
          onChange={setRequest}
          variables={variables}
        />
      </div>

      <Button
        className="shrink-0"
        size="lg"
        onClick={sendRequest}
        disabled={loading || disabled}
      >
        {loading && <Loader2Icon className="size-4 animate-spin" />}
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  )
}
