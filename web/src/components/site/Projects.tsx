import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Icon } from "./Icon"
import { CoverArt } from "./Cover"
import { EmptyPanel, ErrorPanel, ProjectGridSkeleton } from "./states"
import { useProjects } from "@/hooks/use-content"
import { useReducedMotion } from "@/hooks/use-ui"
import { mono } from "@/lib/format"
import { PROJECT_FILTERS, type Project, type ProjectCategory } from "@/lib/types"
import { useUiStore } from "@/stores/ui"

type Filter = "all" | ProjectCategory

/** Keeps the grid free of holes: two lead cards, then threes, with the last row filled. */
function layoutClass(i: number, n: number): string {
  if (n === 1) return " full"
  if (n < 3) return " wide"
  if (i < 2) return " wide"
  const r = (n - 2) % 3
  if (r === 2 && i >= n - 2) return " wide"
  if (r === 1 && i === n - 1) return " full"
  return ""
}

function ProjectCard({ project, layout }: { project: Project; layout: string }) {
  const openCase = useUiStore((s) => s.openCase)
  const isLive = Boolean(project.liveUrl)

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch") return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty("--ry", `${((x - 0.5) * 8).toFixed(2)}deg`)
    el.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`)
    el.style.setProperty("--mx", `${x * 100}%`)
    el.style.setProperty("--my", `${y * 100}%`)
  }
  const onLeave = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg")
    e.currentTarget.style.setProperty("--rx", "0deg")
  }

  return (
    <button
      type="button"
      className={`card${layout}`}
      data-slug={project.slug}
      style={{ "--accent": project.accent, "--accent-2": project.accent2 } as CSSProperties}
      aria-label={`Open case file: ${project.name}`}
      onClick={(e) => openCase(project.slug, e.currentTarget)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="cover">
        <CoverArt project={project} />
        <span className={`badge${isLive ? "" : " repo"}`}>
          <span className="led" />
          {isLive ? "LIVE" : "REPO"}
        </span>
      </div>
      <div className="card-body">
        <span className="card-kind">{project.kind}</span>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <div className="card-foot">
          <span className="mono-stack">
            {project.stack.slice(0, 5).map((s) => (
              <span key={s} title={s}>
                {mono(s)}
              </span>
            ))}
          </span>
          <span className="open">
            Open case file <Icon name="up-right" />
          </span>
        </div>
      </div>
    </button>
  )
}

export function Projects() {
  const q = useProjects()
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState<Filter>("all")
  const gridRef = useRef<HTMLDivElement>(null)
  const before = useRef<Map<string, DOMRect>>(new Map())

  const all = useMemo(() => q.data ?? [], [q.data])
  const visible = useMemo(() => all.filter((p) => filter === "all" || p.categories.includes(filter)), [all, filter])
  const counts = useMemo(() => {
    const m = new Map<Filter, number>([["all", all.length]])
    PROJECT_FILTERS.forEach((f) => f.key !== "all" && m.set(f.key, all.filter((p) => p.categories.includes(f.key as ProjectCategory)).length))
    return m
  }, [all])

  const choose = (next: Filter) => {
    if (next === filter) return
    const rects = new Map<string, DOMRect>()
    gridRef.current?.querySelectorAll<HTMLElement>(".card").forEach((el) => rects.set(el.dataset.slug!, el.getBoundingClientRect()))
    before.current = rects
    setFilter(next)
  }

  // FLIP: cards that stay glide to their new spot; new ones fade in.
  useLayoutEffect(() => {
    const prev = before.current
    before.current = new Map()
    if (!prev.size || reduce) return
    gridRef.current?.querySelectorAll<HTMLElement>(".card").forEach((el, i) => {
      const a = prev.get(el.dataset.slug!)
      const b = el.getBoundingClientRect()
      if (a) {
        const dx = a.left - b.left
        const dy = a.top - b.top
        if (dx || dy)
          el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 560, easing: "cubic-bezier(.16,1,.3,1)" })
      } else {
        el.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], {
          duration: 480,
          delay: i * 40,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "backwards",
        })
      }
    })
  }, [filter, reduce])

  return (
    <section className="sec" id="projects">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">
              Projects <b>{q.isSuccess ? `${visible.length} system${visible.length === 1 ? "" : "s"}` : ""}</b>
            </div>
            <h2>Systems that shipped.</h2>
          </div>
          <p>Each card opens a case file: the live site, architecture, impact and links. Filter by domain, or open one from the hero feed.</p>
        </div>

        <div className="filters" role="group" aria-label="Filter projects">
          {PROJECT_FILTERS.map((f) => (
            <button key={f.key} type="button" className="filter" aria-pressed={filter === f.key} onClick={() => choose(f.key)}>
              {f.label} <small>{q.isSuccess ? counts.get(f.key) ?? 0 : ""}</small>
            </button>
          ))}
        </div>

        <div className="pgrid" ref={gridRef} aria-live="polite" aria-busy={q.isPending}>
          {q.isPending && <ProjectGridSkeleton />}
          {q.isError && <ErrorPanel title="Couldn’t load projects" error={q.error} onRetry={() => q.refetch()} />}
          {q.isSuccess && all.length === 0 && (
            <EmptyPanel title="No projects yet" message="Nothing is published right now. Add a project in the CMS and it will show up here." />
          )}
          {q.isSuccess && all.length > 0 && visible.length === 0 && (
            <EmptyPanel title="No projects in this category" message="Try another filter." />
          )}
          {visible.map((p, i) => (
            <ProjectCard key={p.slug} project={p} layout={layoutClass(i, visible.length)} />
          ))}
        </div>
      </div>
    </section>
  )
}
