import Markdown from "react-markdown"
import { parseDocumentationFields } from "@/lib/parseDocumentationFields"
import { cn } from "@/lib/utils"

interface Props {
  text: string
  className?: string
}

export default function RequestDocumentation({ text, className }: Props) {
  return (
    <details
      key={text}
      open
      className={cn(
        "mb-5 rounded-lg border border-border-subtle bg-surface-subtle p-4",
        className,
      )}
    >
      <summary className="cursor-pointer text-section-title font-semibold text-color-primary">
        Documentation
      </summary>
      <div
        dir="auto"
        className="mt-3 min-w-0 space-y-3 wrap-break-word text-body text-color-secondary"
      >
        <Markdown
          components={{
            h1: ({ children }) => (
              <h4 className="font-semibold text-xl text-color-primary">
                {children}
              </h4>
            ),
            h2: ({ children }) => (
              <h4 className="font-semibold text-lg text-color-primary">
                {children}
              </h4>
            ),
            h3: ({ children }) => (
              <h4 className="font-semibold text-base text-color-primary">
                {children}
              </h4>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-1">{children}</ol>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-color-accent underline break-all"
              >
                {children}
              </a>
            ),
            pre: ({ children, node }) => {
              const code = node?.children[0]
              const text =
                code?.type === "element"
                  ? code.children
                      .map((child) =>
                        child.type === "text" ? child.value : "",
                      )
                      .join("")
                  : ""
              const rows =
                code?.type === "element" && !code.properties.className
                  ? parseDocumentationFields(text)
                  : null
              if (rows) {
                return (
                  <div className="overflow-hidden rounded-md border border-border-subtle">
                    <table
                      dir="ltr"
                      className="w-full table-fixed text-caption"
                    >
                      <thead className="bg-code text-color-muted">
                        <tr>
                          <th className="w-1/2 px-3 py-2 text-left font-medium">
                            Field
                          </th>
                          <th className="px-3 py-2 text-right font-medium">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr
                            key={index}
                            className="border-t border-border-subtle"
                          >
                            <td className="px-3 py-2 align-top text-left break-all">
                              <code>{row.name}</code>
                            </td>
                            <td
                              dir="auto"
                              className="px-3 py-2 align-top text-start wrap-break-word"
                            >
                              {row.description || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
              return (
                <pre
                  dir="ltr"
                  className="overflow-x-auto rounded-md bg-code p-3 text-left text-color-code text-caption"
                >
                  {children}
                </pre>
              )
            },
            code: ({ children }) => (
              <code className="font-mono">{children}</code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-border pl-3">
                {children}
              </blockquote>
            ),
            img: ({ alt }) => <span>{alt}</span>,
          }}
        >
          {text}
        </Markdown>
      </div>
    </details>
  )
}
