interface Props {
  responseInfo: ResponseInfo | null
  loading: boolean
  error?: string
}
const ResponseStatusBar = ({ responseInfo, loading, error = "" }: Props) => {
  if (!loading && !responseInfo && !error) return null

  const isError =
    (!responseInfo && Boolean(error)) ||
    (responseInfo !== null &&
      responseInfo.statusCode >= 400 &&
      responseInfo.statusCode < 600)
  const statusLabel = responseInfo?.statusLabel ?? error

  const statusColor = loading
    ? "text-status-info-fg"
    : isError
      ? "text-status-error-fg"
      : "text-status-success-fg"

  const dotColor = loading
    ? "bg-status-info-fg"
    : isError
      ? "bg-status-error-fg"
      : "bg-status-success-fg"

  return (
    <div
      role={error && !loading ? "alert" : undefined}
      className="flex flex-wrap items-center justify-between gap-2 bg-surface-subtle border border-border-subtle rounded-md mx-4 p-2"
    >
      <div className={`${statusColor} flex min-w-0 items-center gap-2`}>
        <div className={`shrink-0 rounded-full size-2 ${dotColor}`} />
        <div className="min-w-0 wrap-break-word">
          {loading ? "Loading" : statusLabel}
          {!loading && responseInfo && error && (
            <span className="text-status-error-fg"> · {error}</span>
          )}
        </div>
      </div>
      {(responseInfo || loading) && (
        <div className="text-color-secondary text-caption flex gap-4">
          <div>{loading ? "— ms" : `${responseInfo?.duration ?? "—"} ms`}</div>
          <div>{loading ? "— KB" : `${responseInfo?.size ?? "—"} KB`}</div>
        </div>
      )}
    </div>
  )
}

export default ResponseStatusBar
