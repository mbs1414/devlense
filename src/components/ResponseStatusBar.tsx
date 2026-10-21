interface Props {
  responseInfo: ResponseInfo | null
  loading: boolean
}
const ResponseStatusBar = ({ responseInfo, loading }: Props) => {
  if (!loading && !responseInfo) return null

  const isError =
    responseInfo !== null &&
    responseInfo.statusCode >= 400 &&
    responseInfo.statusCode < 600

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
    <div className="flex items-center justify-between bg-surface-subtle border border-border-subtle rounded-md mx-4 p-2">
      <div className={`${statusColor} flex items-center gap-2`}>
        <div className={`rounded-full size-2 ${dotColor}`} />
        <div>{loading ? "Loading" : responseInfo?.statusLabel}</div>
      </div>
      <div className="text-color-secondary text-caption flex gap-4">
        <div>{loading ? "— ms" : `${responseInfo?.duration ?? "—"} ms`}</div>
        <div>{loading ? "— KB" : `${responseInfo?.size ?? "—"} KB`}</div>
      </div>
    </div>
  )
}

export default ResponseStatusBar
