import RequestDocumentationContent from "@/components/RequestDocumentationContent"

export default function RequestDocumentation({ text }: { text: string }) {
  return (
    <details
      key={text}
      open
      className="mb-5 rounded-lg border border-border-subtle bg-surface-subtle p-4"
    >
      <summary className="cursor-pointer text-section-title font-semibold text-color-primary">
        Documentation
      </summary>
      <div className="mt-3">
        <RequestDocumentationContent text={text} />
      </div>
    </details>
  )
}
