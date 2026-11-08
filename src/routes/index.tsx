import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, CodeXml, Sparkles } from "lucide-react"

const particles = [
  { x: 14, y: 23, size: 5, duration: 3.8, delay: 1.4 },
  { x: 21, y: 68, size: 4, duration: 4.4, delay: 0.2 },
  { x: 29, y: 37, size: 4, duration: 3.5, delay: 2.1 },
  { x: 35, y: 78, size: 5, duration: 4.8, delay: 0.8 },
  { x: 43, y: 18, size: 4, duration: 3.7, delay: 2.7 },
  { x: 57, y: 25, size: 5, duration: 4.3, delay: 1.1 },
  { x: 65, y: 74, size: 4, duration: 3.6, delay: 0.5 },
  { x: 72, y: 39, size: 5, duration: 4.7, delay: 2.4 },
  { x: 79, y: 63, size: 4, duration: 3.9, delay: 1.8 },
  { x: 86, y: 29, size: 4, duration: 4.5, delay: 0.1 },
  { x: 8, y: 47, size: 3, duration: 4.1, delay: 1.2 },
  { x: 11, y: 82, size: 4, duration: 3.6, delay: 2.3 },
  { x: 18, y: 12, size: 3, duration: 4.6, delay: 0.6 },
  { x: 25, y: 51, size: 3, duration: 3.8, delay: 1.9 },
  { x: 31, y: 88, size: 4, duration: 4.3, delay: 0.3 },
  { x: 38, y: 29, size: 3, duration: 3.7, delay: 2.6 },
  { x: 40, y: 61, size: 4, duration: 4.9, delay: 1.5 },
  { x: 47, y: 83, size: 3, duration: 4.2, delay: 0.9 },
  { x: 51, y: 11, size: 4, duration: 3.5, delay: 2.2 },
  { x: 54, y: 55, size: 3, duration: 4.7, delay: 0.4 },
  { x: 60, y: 88, size: 4, duration: 3.9, delay: 1.7 },
  { x: 67, y: 16, size: 3, duration: 4.4, delay: 2.8 },
  { x: 70, y: 57, size: 4, duration: 3.6, delay: 0.7 },
  { x: 75, y: 84, size: 3, duration: 4.8, delay: 1.3 },
  { x: 82, y: 11, size: 4, duration: 4.1, delay: 2.5 },
  { x: 89, y: 48, size: 3, duration: 3.7, delay: 0.2 },
  { x: 92, y: 76, size: 4, duration: 4.5, delay: 1.6 },
  { x: 5, y: 31, size: 3, duration: 4.3, delay: 2.9 },
  { x: 95, y: 20, size: 3, duration: 3.8, delay: 1.0 },
  { x: 46, y: 43, size: 3, duration: 4.6, delay: 0.5 },
  { x: 62, y: 36, size: 3, duration: 3.5, delay: 1.4 },
  { x: 27, y: 18, size: 4, duration: 4.9, delay: 2.0 },
  { x: 84, y: 88, size: 3, duration: 4.0, delay: 0.8 },
]

export const Route = createFileRoute("/")({
  component: function RouteComponent() {
    return (
      <section className="relative isolate flex min-h-[calc(100svh-10.25rem-env(safe-area-inset-bottom))] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border-subtle bg-surface px-6 py-16 text-center md:min-h-[calc(100svh-3rem)]">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--action-primary) 16%, transparent), transparent 34%), radial-gradient(circle at 50% 50%, transparent 0, transparent 1px, color-mix(in srgb, var(--text-color-primary) 3%, transparent) 1px)",
            backgroundSize: "auto, 28px 28px",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] -z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action-primary/15 blur-3xl sm:size-96"
          aria-hidden="true"
        />
        <div
          className="welcome-orbit pointer-events-none absolute left-1/2 top-[42%] -z-10 size-72 rounded-full border border-dashed border-action-primary/20 sm:size-[30rem]"
          aria-hidden="true"
        />
        <div
          className="welcome-orbit-reverse pointer-events-none absolute left-1/2 top-[42%] -z-10 size-56 rounded-full border border-action-primary/10 sm:size-96"
          aria-hidden="true"
        />
        {particles.map((particle) => (
          <span
            key={`${particle.x}-${particle.y}`}
            className="welcome-particle pointer-events-none absolute z-0 rounded-full bg-action-primary shadow-[0_0_14px_var(--action-primary)]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              animationDuration: `${particle.duration}s`,
              animationDelay: `-${particle.delay}s`,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="absolute left-[8%] top-[22%] hidden -rotate-6 items-center gap-2 rounded-xl border border-border-subtle bg-surface/80 px-3 py-2 font-mono text-xs text-color-secondary shadow-lg shadow-action-primary/5 backdrop-blur-md lg:flex">
          <span className="font-semibold text-status-success-fg">GET</span>
          <span>/api/v1/users</span>
        </div>
        <div className="absolute bottom-[23%] right-[8%] hidden rotate-6 items-center gap-2 rounded-xl border border-border-subtle bg-surface/80 px-3 py-2 text-xs font-medium text-color-secondary shadow-lg shadow-action-primary/5 backdrop-blur-md lg:flex">
          <span className="size-2 rounded-full bg-status-success-fg shadow-[0_0_10px_var(--status-success-fg)]" />
          200 · Response received
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8 flex size-20 items-center justify-center rounded-3xl border border-action-primary/30 bg-surface/70 text-action-primary shadow-[0_0_60px_color-mix(in_srgb,var(--action-primary)_28%,transparent)] backdrop-blur-sm">
            <div className="absolute inset-2 rounded-2xl bg-action-primary/10" />
            <CodeXml className="relative size-10" strokeWidth={1.7} aria-hidden="true" />
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-surface bg-action-primary text-action-primary-text shadow-md">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/80 px-3.5 py-1.5 text-caption font-medium text-color-secondary backdrop-blur">
            <Sparkles className="size-3.5 text-action-primary" aria-hidden="true" />
            Your API workspace
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-color-primary sm:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-action-primary to-devlens-violet-300 bg-clip-text text-transparent">
              DevLens
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-body leading-relaxed text-color-secondary sm:text-lg">
            A clearer way to build, send, and organize your API requests.
            Everything you need, right where you need it.
          </p>

          <Link
            to="/request"
            className="group mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-action-primary px-5 py-3 text-label font-semibold text-action-primary-text shadow-lg shadow-action-primary/20 transition-all hover:-translate-y-0.5 hover:bg-action-primary-hover hover:shadow-xl hover:shadow-action-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Start building requests
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
    )
  },
})
