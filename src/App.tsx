import {
  ArrowRight,
  Braces,
  Check,
  Clock3,
  Code2,
  Copy,
  Database,
  GitFork,
  Globe2,
  History,
  Layers3,
  Play,
  Send,
  Sparkles,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Zap,
    title: "Fast request workflows",
    description:
      "Compose and send HTTP requests without the clutter of an enterprise workspace.",
  },
  {
    icon: Braces,
    title: "Readable responses",
    description:
      "Inspect formatted JSON, raw payloads, headers, timing, and response size at a glance.",
  },
  {
    icon: Layers3,
    title: "Focused collections",
    description:
      "Save useful requests and keep APIs organized in lightweight, searchable collections.",
  },
  {
    icon: Globe2,
    title: "Flexible environments",
    description:
      "Switch variables between local, staging, and production without rewriting request URLs.",
  },
]

const responseLines = [
  <span className="text-zinc-500">&#123;</span>,
  <>
    <span className="text-violet-300">&quot;users&quot;</span>
    <span className="text-zinc-500">: [</span>
  </>,
  <>
    <span className="text-zinc-500">&#123; </span>
    <span className="text-violet-300">&quot;id&quot;</span>
    <span className="text-zinc-500">: </span>
    <span className="text-amber-300">1</span>
    <span className="text-zinc-500">, </span>
    <span className="text-violet-300">&quot;name&quot;</span>
    <span className="text-zinc-500">: </span>
    <span className="text-emerald-300">&quot;Ada Lovelace&quot;</span>
    <span className="text-zinc-500"> &#125;,</span>
  </>,
  <>
    <span className="text-zinc-500">&#123; </span>
    <span className="text-violet-300">&quot;id&quot;</span>
    <span className="text-zinc-500">: </span>
    <span className="text-amber-300">2</span>
    <span className="text-zinc-500">, </span>
    <span className="text-violet-300">&quot;name&quot;</span>
    <span className="text-zinc-500">: </span>
    <span className="text-emerald-300">&quot;Grace Hopper&quot;</span>
    <span className="text-zinc-500"> &#125;</span>
  </>,
  <span className="text-zinc-500">],</span>,
  <>
    <span className="text-violet-300">&quot;total&quot;</span>
    <span className="text-zinc-500">: </span>
    <span className="text-amber-300">2</span>
  </>,
  <span className="text-zinc-500">&#125;</span>,
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg border border-violet-400/30 bg-violet-500/15 text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.16)]">
        <Code2 className="size-4" strokeWidth={2.2} />
        <div className="absolute inset-x-1 bottom-0 h-px bg-violet-400/60" />
      </div>
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-100">
        DevLens
      </span>
    </div>
  )
}

function ApiClientPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute -inset-6 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(124,58,237,0.22),transparent_58%)] blur-2xl" />
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="flex h-11 items-center justify-between border-b border-white/8 bg-[#151517] px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <span className="hidden text-[11px] font-medium text-zinc-500 sm:inline">
              DevLens / New Request
            </span>
          </div>
          <Badge
            variant="outline"
            className="h-5 border-white/10 bg-white/[0.03] px-2 text-[10px] font-normal text-zinc-400"
          >
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Development
          </Badge>
        </div>

        <div className="grid min-h-[480px] md:grid-cols-[156px_1fr]">
          <aside className="hidden border-r border-white/8 bg-[#0e0e10] p-3 md:block">
            <div className="mb-5 flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-violet-300">
              <Play className="size-3.5 fill-violet-300/10" />
              Request
            </div>
            <div className="space-y-1 text-[11px] text-zinc-500">
              {[
                [History, "History"],
                [Layers3, "Collections"],
                [Database, "Environments"],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="flex items-center gap-2 rounded-md px-2 py-2"
                >
                  <Icon className="size-3.5" />
                  <span>{label as string}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/8 pt-4">
              <p className="px-2 text-[9px] font-semibold tracking-[0.16em] text-zinc-700 uppercase">
                Recent
              </p>
              <div className="mt-2 space-y-1.5 px-2 text-[10px] text-zinc-600">
                <p className="truncate">GET /users</p>
                <p className="truncate">POST /auth/login</p>
                <p className="truncate">PATCH /users/12</p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 p-3 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0f]">
                <div className="flex h-10 items-center border-r border-white/10 px-3 font-mono text-[11px] font-semibold text-emerald-400">
                  GET
                </div>
                <div className="flex min-w-0 flex-1 items-center truncate px-3 font-mono text-[11px] text-zinc-300 sm:text-xs">
                  https://api.devlens.dev/v1/users
                </div>
              </div>
              <Button className="h-10 bg-violet-600 px-4 text-white shadow-[0_0_22px_rgba(124,58,237,0.22)] hover:bg-violet-500">
                <Send className="size-3.5" />
                Send
              </Button>
            </div>

            <div className="mt-4 flex gap-5 border-b border-white/8 text-[11px] text-zinc-500">
              {[
                ["Params", "2"],
                ["Headers", "3"],
                ["Body", ""],
                ["Auth", ""],
              ].map(([label, count], index) => (
                <div
                  key={label}
                  className={`flex h-8 items-center gap-1.5 border-b ${
                    index === 0
                      ? "border-violet-400 text-zinc-200"
                      : "border-transparent"
                  }`}
                >
                  {label}
                  {count && (
                    <span className="rounded bg-white/5 px-1 text-[9px] text-zinc-500">
                      {count}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="py-4">
              <div className="grid grid-cols-[18px_1fr_1fr] gap-2 text-[9px] font-medium tracking-[0.08em] text-zinc-600 uppercase sm:grid-cols-[18px_1fr_1fr_1.2fr]">
                <span />
                <span>Key</span>
                <span>Value</span>
                <span className="hidden sm:block">Description</span>
              </div>
              {[
                ["page", "1", "Pagination page"],
                ["limit", "20", "Results per page"],
              ].map(([key, value, description]) => (
                <div
                  key={key}
                  className="mt-2 grid grid-cols-[18px_1fr_1fr] gap-2 sm:grid-cols-[18px_1fr_1fr_1.2fr]"
                >
                  <div className="mt-2.5 flex size-3.5 items-center justify-center rounded border border-violet-400/50 bg-violet-500/20 text-violet-300">
                    <Check className="size-2.5" strokeWidth={3} />
                  </div>
                  {[key, value, description].map((item, index) => (
                    <div
                      key={item}
                      className={`flex h-8 items-center rounded-md border border-white/8 bg-white/[0.025] px-2 font-mono text-[10px] text-zinc-400 ${
                        index === 2 ? "hidden sm:flex" : ""
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b0b0d]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-3 py-2.5">
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    200 OK
                  </span>
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Clock3 className="size-3" /> 184 ms
                  </span>
                  <span className="text-zinc-500">1.24 KB</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                  <span className="text-zinc-300">Pretty</span>
                  <span>Raw</span>
                  <Copy className="size-3" />
                </div>
              </div>
              <div className="overflow-x-auto p-3 font-mono text-[10px] leading-5 sm:p-4 sm:text-[11px]">
                {responseLines.map((line, index) => (
                  <div key={index} className="flex min-w-max">
                    <span className="mr-4 w-3 text-right text-zinc-700 select-none">
                      {index + 1}
                    </span>
                    <code className={index > 0 && index < 6 ? "pl-3" : ""}>
                      {line}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#09090b] font-sans text-zinc-100 selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.18),transparent_36%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      <header className="relative z-20 border-b border-white/8 bg-[#09090b]/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="hidden items-center gap-7 text-xs text-zinc-500 md:flex">
            <a className="transition-colors hover:text-zinc-200" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-zinc-200" href="#preview">
              Preview
            </a>
            <a className="transition-colors hover:text-zinc-200" href="#about">
              About
            </a>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              <GitFork className="size-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
            <Button
              size="sm"
              className="bg-zinc-100 text-zinc-950 hover:bg-white"
            >
              Open DevLens
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32">
          <Badge
            variant="outline"
            className="mb-6 h-7 border-violet-400/20 bg-violet-500/10 px-3 text-[11px] font-medium text-violet-300"
          >
            <Sparkles className="size-3" />
            A focused API client for modern developers
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-[72px]">
            Inspect APIs with
            <span className="block bg-gradient-to-r from-violet-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              clarity, not clutter.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 text-pretty sm:text-lg">
            DevLens is a lightweight, browser-based API client for composing
            requests, exploring responses, and keeping your development flow
            beautifully focused.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button className="h-10 bg-violet-600 px-5 text-white shadow-[0_0_34px_rgba(124,58,237,0.28)] hover:bg-violet-500">
              Try the preview
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-10 border-white/10 bg-white/[0.03] px-5 text-zinc-300 hover:bg-white/[0.07] hover:text-white"
            >
              <GitFork className="size-4" />
              View on GitHub
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-600">
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400" /> No account required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400" /> Browser based
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3 text-violet-400" /> Open source
            </span>
          </div>
        </section>

        <section id="preview" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <ApiClientPreview />
        </section>

        <section
          id="features"
          className="border-y border-white/8 bg-white/[0.015] py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 border-white/10 bg-white/[0.025] text-zinc-400"
              >
                Built for flow
              </Badge>
              <h2 className="text-3xl font-semibold tracking-[-0.035em] text-zinc-100 sm:text-4xl">
                Everything you need. Nothing you do not.
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-500 sm:text-base">
                A deliberate set of tools for everyday API work, organized
                around speed, legibility, and fewer unnecessary clicks.
              </p>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group bg-[#0c0c0f] p-6 transition-colors hover:bg-[#111114]"
                >
                  <div className="mb-8 flex size-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-zinc-400 transition-colors group-hover:border-violet-400/20 group-hover:text-violet-300">
                    <feature.icon className="size-4" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-200">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101012] px-5 py-14 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.18),transparent_55%)]" />
            <div className="relative">
              <div className="mx-auto mb-5 flex size-10 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300">
                <Code2 className="size-5" />
              </div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Your API workflow, in focus.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                Send a request, understand the response, and get back to
                building. DevLens keeps the important things close and the
                noise out of your way.
              </p>
              <Button className="mt-7 h-10 bg-zinc-100 px-5 text-zinc-950 hover:bg-white">
                Open DevLens
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 sm:flex-row sm:px-6 lg:px-8">
          <Logo />
          <p className="text-center text-[11px] text-zinc-600">
            A lightweight API client built for focused development.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-zinc-600">
            <span>Open source</span>
            <span className="size-1 rounded-full bg-zinc-800" />
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
