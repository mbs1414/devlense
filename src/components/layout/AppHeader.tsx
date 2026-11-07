const AppHeader = () => {
  return (
    <header className="sticky text-color-primary top-0 z-20 flex h-14 shrink-0 px-4 items-center gap-2.5 border-b border-border-subtle bg-surface md:hidden">
      <div className="size-6 rounded-full bg-action-primary" aria-hidden="true" />
      <span className="font-semibold">DevLens</span>
    </header>
  )
}

export default AppHeader
