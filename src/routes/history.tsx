import PlaceholderState from "@/components/PlaceholderState"
import MethodBadge from "@/components/MethodBadge"
import { Card, CardContent } from "@/components/ui/card"
import { useHistory } from "@/hooks/useHistory"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/history")({
  component: function HistoryPage() {
    const [history, setHistory] = useState<RequestHistory[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [hasError, setHasError] = useState(false)
    const { loadHistoryFromIndexedDB } = useHistory()

    useEffect(() => {
      let cancelled = false

      const loadHistory = async () => {
        try {
          const savedHistory = await loadHistoryFromIndexedDB()
          if (!cancelled) setHistory(savedHistory)
        } catch {
          if (!cancelled) setHasError(true)
        } finally {
          if (!cancelled) setIsLoadingHistory(false)
        }
      }

      void loadHistory()

      return () => {
        cancelled = true
      }
    }, [loadHistoryFromIndexedDB])

    const groupedHistory = history.reduce<Record<string, RequestHistory[]>>(
      (groups, entry) => {
        const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

        if (!groups[date]) groups[date] = []
        groups[date].push(entry)
        return groups
      },
      {},
    )

    return (
      <div className="h-full flex flex-col">
        <h1 className="text-color-primary font-semibold text-page-title mb-4">
          History
        </h1>

        {isLoadingHistory ? (
          <p className="text-color-secondary">Loading history...</p>
        ) : hasError ? (
          <PlaceholderState
            variant="panel"
            title="Unable to load history"
            description="Refresh the page to try again."
          />
        ) : history.length === 0 ? (
          <PlaceholderState
            variant="panel"
            title="No request history"
            description="Requests you send will appear here, grouped by date."
          />
        ) : (
          <Card className="bg-surface flex-1">
            <CardContent className="space-y-6">
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <section key={date}>
                  <h2 className="text-label text-color-secondary mb-3">
                    {date}
                  </h2>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-wrap items-center gap-4 rounded-md border border-border-subtle bg-surface-subtle p-3"
                      >
                        <MethodBadge method={entry.method} />
                        <div className="min-w-0 flex-1">
                          {entry.name && (
                            <p className="text-body text-color-primary mb-1">
                              {entry.name}
                            </p>
                          )}
                          <p className="break-all font-mono text-label text-color-secondary">
                            {entry.url}
                          </p>
                          {entry.collectionName && (
                            <p className="text-caption text-color-muted mt-1">
                              {entry.collectionName}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-caption text-color-muted">
                          <span
                            className={
                              entry.statusCode === null ||
                              entry.statusCode >= 400
                                ? "text-status-error-fg"
                                : "text-status-success-fg"
                            }
                          >
                            {entry.statusLabel}
                          </span>
                          <span>{entry.duration} ms</span>
                          {entry.size !== null && <span>{entry.size} KB</span>}
                          <time
                            dateTime={new Date(entry.createdAt).toISOString()}
                          >
                            {new Date(entry.createdAt).toLocaleTimeString(
                              undefined,
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    )
  },
})
