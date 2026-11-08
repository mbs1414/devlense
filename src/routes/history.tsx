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
      <div className="h-full min-w-0 flex flex-col lg:h-[calc(100dvh-3rem)]">
        <h1 className="hidden md:block shrink-0 text-color-primary font-semibold text-page-title mb-4">
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
          <Card className="bg-surface min-w-0 flex-1 lg:min-h-0">
            <CardContent
              className="space-y-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
              role="region"
              aria-label="Request history"
              tabIndex={0}
            >
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <section key={date}>
                  <h2 className="text-label text-color-secondary mb-3">
                    {date}
                  </h2>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-col xl:flex-row xl:items-center gap-4 rounded-md border border-border-subtle bg-surface-subtle p-3"
                      >
                        <div className="w-full min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MethodBadge
                              method={entry.method}
                              className="shrink-0"
                            />
                            {entry.name && (
                              <p className="min-w-0 break-all text-body text-color-primary">
                                {entry.name}
                              </p>
                            )}
                          </div>
                          <p className="break-all font-mono text-label text-color-secondary">
                            {entry.url}
                          </p>
                          {entry.collectionName && (
                            <p className="break-all text-caption text-color-muted mt-1">
                              {entry.collectionName}
                            </p>
                          )}
                        </div>
                        <dl className="grid grid-cols-2 gap-3 w-full min-w-0 text-caption tabular-nums sm:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] xl:w-112 xl:shrink-0 xl:gap-6">
                          <div className="min-w-0">
                            <dt className="text-color-muted">Status</dt>
                            <dd
                              className={
                                entry.statusCode === null ||
                                entry.statusCode >= 400
                                  ? "break-words text-status-error-fg"
                                  : "break-words text-status-success-fg"
                              }
                            >
                              {entry.statusLabel}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-color-muted">Duration</dt>
                            <dd className="text-color-secondary">
                              {entry.duration} ms
                            </dd>
                          </div>
                          <div>
                            <dt className="text-color-muted">Size</dt>
                            <dd className="text-color-secondary">
                              {entry.size !== null ? `${entry.size} KB` : "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-color-muted">Time</dt>
                            <dd className="text-color-secondary">
                              <time
                                dateTime={new Date(
                                  entry.createdAt,
                                ).toISOString()}
                              >
                                {new Date(entry.createdAt).toLocaleTimeString(
                                  undefined,
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </time>
                            </dd>
                          </div>
                        </dl>
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
