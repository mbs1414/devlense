import { Copy } from "lucide-react"
import { toast } from "sonner"

import { getRequestDetails } from "@/lib/getRequestDetails"
import RequestDocumentation from "./RequestDocumentation"

import MethodBadge from "./MethodBadge"
import PlaceholderState from "./PlaceholderState"
import { RequestFieldsTable } from "./RequestFieldsTable"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

interface Props {
  item: PostmanItem | null
  path: string
  onOpenRequest: () => void
}

export default function CollectionRequestDetails({
  item,
  path,
  onOpenRequest,
}: Props) {
  if (!item || item.request == null) {
    return (
      <section className="flex-1 min-h-0 p-5">
        <PlaceholderState
          title="Select a request"
          description="Choose an API from a collection to view its details."
          showBorder={false}
        />
      </section>
    )
  }

  const {
    name,
    method,
    rawUrl,
    documentation,
    queryParams,
    headers,
    headerText,
    bodyFields,
    bodyText,
  } = getRequestDetails(item)

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(rawUrl)
      toast.success("URL copied")
    } catch {
      toast.error("Unable to copy URL")
    }
  }

  return (
    <section className="flex-1 min-w-0 min-h-0 p-5">
      <div>
        <p className="text-color-secondary text-caption mb-4 break-all">
          {path}
        </p>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <div className="min-w-0">
            <h2 className="text-color-primary text-page-title mb-2 break-all">
              {name}
            </h2>
          </div>
          <Button size="lg" onClick={onOpenRequest}>
            Open in Request
          </Button>
        </div>

        <div className="flex justify-between items-center bg-canvas p-2 gap-2 border border-border-subtle rounded-md">
          <MethodBadge method={method} />
          <p className="flex-1 min-w-0 break-all font-mono text-(length:--text-code) text-color-secondary">
            {rawUrl || "No URL provided"}
          </p>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Copy URL"
            disabled={!rawUrl}
            onClick={copyUrl}
          >
            <Copy className="size-4 text-color-secondary" />
          </Button>
        </div>
      </div>

      <Separator className="my-4 bg-border-subtle" />

      {documentation && <RequestDocumentation text={documentation} />}

      <div className="mb-5">
        <h3 className="text-section-title text-color-primary mb-2">
          Query parameters
        </h3>
        {queryParams.length > 0 ? (
          <RequestFieldsTable fields={queryParams} />
        ) : (
          <p className="text-color-muted text-caption">No query parameters.</p>
        )}
      </div>

      <div className="mb-5">
        <h3 className="text-section-title text-color-primary mb-2">Headers</h3>
        {headerText ? (
          <pre className="whitespace-pre-wrap break-all text-color-secondary text-caption">
            {headerText}
          </pre>
        ) : headers.length > 0 ? (
          <RequestFieldsTable fields={headers} />
        ) : (
          <p className="text-color-muted text-caption">No headers.</p>
        )}
      </div>

      <div>
        <h3 className="text-section-title text-color-primary mb-2">
          Request body
        </h3>
        {bodyFields.length > 0 ? (
          <RequestFieldsTable fields={bodyFields} />
        ) : bodyText ? (
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md border border-border-subtle bg-canvas p-3 font-mono text-(length:--text-code) text-color-secondary">
            {bodyText}
          </pre>
        ) : (
          <p className="text-color-muted text-caption">No request body.</p>
        )}
      </div>
    </section>
  )
}
