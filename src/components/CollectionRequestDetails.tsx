import { Copy } from "lucide-react"
import MethodBadge from "./MethodBadge"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { RequestFieldsTable } from "./RequestFieldsTable"

export default function CollectionRequestDetails() {
  return (
    <section className="flex-1 min-h-0 overflow-y-auto p-5">
      <div>
        <p className="text-color-secondary text-caption mb-4">
          Commerce API / Products
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-color-primary text-page-title mb-2">
              List products
            </h2>
            <p className="text-color-secondary text-body">
              Retrieve a paginated list of products.
            </p>
          </div>
          <Button size="lg">Open in Request</Button>
        </div>

        <div className="flex justify-between items-center bg-canvas p-2 gap-2 border border-border-subtle rounded-md">
          <MethodBadge method="GET" />
          <p className="flex-1 font-mono text-(length:--text-code) text-color-secondary">{`{{baseUrl}}/products`}</p>
          <Button variant="ghost" size="icon">
            <Copy className="size-4 text-color-secondary" />
          </Button>
        </div>
      </div>

      <Separator className="my-4 bg-border-subtle" />

      <div className="mb-5">
        <h3 className="text-section-title text-color-primary mb-2">
          Query parameters
        </h3>
        <RequestFieldsTable
          fields={[
            { key: "page", value: "1", description: "Page number." },
            { key: "limit", value: "20", description: "Results per page." },
          ]}
        />
      </div>

      <div className="mb-5">
        <h3 className="text-section-title text-color-primary mb-2">Headers</h3>
        <RequestFieldsTable
          fields={[
            {
              key: "Accept",
              value: "application/json",
            },
            {
              key: "Authorization",
              value: "Bearer token",
            },
          ]}
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-section-title text-color-primary mb-2">
            Request body
          </h3>
          <p className="text-color-muted text-caption">application/json</p>
        </div>
      </div>
      <RequestFieldsTable
        body={[
          {
            key: "name",
            value: "string",
            description: "Product name",
          },
          {
            key: "price",
            value: "number",
            description: "Product price",
          },
          {
            key: "category",
            value: "object",
            children: [
              {
                key: "id",
                value: "number",
              },
              {
                key: "name",
                value: "string",
              },
            ],
          },
          {
            key: "variants",
            value: "array<object>",
            children: [
              {
                key: "sku",
                value: "string",
              },
              {
                key: "attributes",
                value: "object",
                children: [
                  { key: "color", value: "string" },
                  { key: "size", value: "string" },
                ],
              },
            ],
          },
        ]}
      />
    </section>
  )
}
