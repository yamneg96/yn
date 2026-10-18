import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { Icon } from "./Icon"
import { MediaPanel } from "./LiveBrowser"
import { useProjects } from "@/hooks/use-content"
import { useCountUp, useReducedMotion } from "@/hooks/use-ui"
import { archSvg } from "@/lib/art"
import { useUiStore } from "@/stores/ui"
import type { Project } from "@/lib/types"

const EASE = "cubic-bezier(.16,1,.3,1)"

function Metric({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const n = useCountUp(value, true, 1200)
  return (
    <div className="metric">
      <b>
        {n}
        {suffix ?? ""}
      </b>
      <span>{label}</span>
    </div>
  )
}

function Body({ project, prev, next, onGo }: { project: Project; prev: Project; next: Project; onGo: (slug: string, dir: 1 | -1) => void }) {
  const live = Boolean(project.liveUrl)
  const arch = useMemo(() => archSvg(project), [project])
  return (
    <>
      <MediaPanel key={project.slug} project={project} />

      <div className="m-top">
        <div>
          <div className="eyebrow">
            Case file <b>/ {project.kind}</b>
          </div>
          <h2 className="m-title" id="mTitle">
            {project.title}
          </h2>
          <p className="m-tag">{project.overview}</p>
        </div>
        <aside className="glance">
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{project.kind}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd style={{ display: "inline-flex", gap: 8, alignItems: "center", justifyContent: "flex-end" }}>
                <span className="led" style={live ? undefined : { background: "var(--fg-3)", animation: "none" }} />
                {live ? "Live" : "Source only"}
              </dd>
            </div>
          </dl>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Stack
            </div>
            <div className="stack">
              {project.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="links">
            {project.liveUrl && (
              <a className="btn btn-primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Live demo <Icon name="up-right" />
              </a>
            )}
            {project.adminUrl && (
              <a className="btn btn-ghost" href={project.adminUrl} target="_blank" rel="noopener noreferrer">
                Admin panel <Icon name="up-right" />
              </a>
            )}
            {project.mobileUrl && (
              <a className="btn btn-ghost" href={project.mobileUrl} target="_blank" rel="noopener noreferrer">
                Install mobile app <Icon name="up-right" />
              </a>
            )}
            {project.sourceUrl && (
              <a className="btn btn-ghost" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                Source code <Icon name="up-right" />
              </a>
            )}
          </div>
        </aside>
      </div>

      <div className="m-cols">
        <div className="m-col">
          <h4>Challenge</h4>
          <p>{project.challenge}</p>
        </div>
        <div className="m-col">
          <h4>Solution</h4>
          <p>{project.solution}</p>
        </div>
        <div className="m-col">
          <h4>Outcome</h4>
          <p>{project.outcome || (live ? "Deployed and in use. The live demo is linked above." : "Source is public on GitHub. Not deployed as a public demo.")}</p>
        </div>
      </div>

      {project.features.length > 0 && (
        <div>
          <div className="sub">Key features</div>
          <ul className="feat">
            {project.features.map((f) => (
              <li key={f}>
                <Icon name="check" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="sub">Architecture</div>
        <div className="arch" dangerouslySetInnerHTML={{ __html: arch }} />
      </div>

      {project.metrics.length > 0 && (
        <div>
          <div className="sub">Impact</div>
          <div className="metrics">
            {project.metrics.map((m) => (
              <Metric key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
            ))}
          </div>
        </div>
      )}

      <div className="nextp">
        <button type="button" onClick={() => onGo(prev.slug, -1)}>
          <small>Previous</small>
          <strong>{prev.name}</strong>
        </button>
        <button type="button" className="nx" onClick={() => onGo(next.slug, 1)}>
          <small>Next</small>
          <strong>{next.name}</strong>
        </button>
      </div>
    </>
  )
}

/** The case-file modal: expands out of the clicked card, swaps between projects, traps focus. */
export function CaseFile() {
  const { data } = useProjects()
  const projects = useMemo(() => data ?? [], [data])
  const slug = useUiStore((s) => s.caseSlug)
  const origin = useUiStore((s) => s.caseOrigin)
  const { openCase, swapCase, closeCase } = useUiStore.getState()
  const reduce = useReducedMotion()

  const [shown, setShown] = useState<string | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const dir = useRef<1 | -1>(1)
  const closing = useRef(false)

  const index = shown ? projects.findIndex((p) => p.slug === shown) : -1
  const project = index >= 0 ? projects[index] : null
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  const clipFrom = (rect: { top: number; right: number; bottom: number; left: number }) => {
    const s = sheetRef.current!.getBoundingClientRect()
    return `inset(${Math.max(0, rect.top - s.top)}px ${Math.max(0, s.right - rect.right)}px ${Math.max(0, s.bottom - rect.bottom)}px ${Math.max(0, rect.left - s.left)}px round 14px)`
  }

  // Deep link: /#case-<slug> opens the case file once projects have loaded.
  useEffect(() => {
    if (!projects.length || !/^#case-/.test(location.hash)) return
    const want = location.hash.slice(6)
    if (projects.some((p) => p.slug === want)) {
      const t = setTimeout(() => openCase(want, null), 300)
      return () => clearTimeout(t)
    }
  }, [projects, openCase])

  // Open / swap / close, driven by the store.
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (slug && !shown && projects.some((p) => p.slug === slug)) {
      closing.current = false
      lastFocus.current = document.activeElement as HTMLElement | null
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(slug)
      document.body.style.overflow = "hidden"
      try {
        history.replaceState(null, "", `#case-${slug}`)
      } catch {
        /* ignore */
      }
      return
    }
    if (slug && shown && slug !== shown) {
      const body = bodyRef.current
      const finish = () => setShown(slug)
      if (reduce || !body) return finish()
      const out = body.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-40 * dir.current}px)` }], {
        duration: 220,
        easing: "ease-in",
        fill: "forwards",
      })
      out.onfinish = () => {
        finish()
        out.cancel()
      }
      try {
        history.replaceState(null, "", `#case-${slug}`)
      } catch {
        /* ignore */
      }
      return
    }
    if (!slug && shown && !closing.current && sheet) {
      closing.current = true
      const done = () => {
        setShown(null)
        document.body.style.overflow = ""
        try {
          history.replaceState(null, "", location.pathname)
        } catch {
          /* ignore */
        }
        lastFocus.current?.focus?.()
      }
      const el = origin
      if (reduce || !el || !document.body.contains(el) || el.hidden) return done()
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) return done()
      const a = sheet.animate([{ clipPath: "inset(0px round 26px)", opacity: 1 }, { clipPath: clipFrom(r), opacity: 0.4 }], {
        duration: 480,
        easing: EASE,
        fill: "forwards",
      })
      backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 480, fill: "forwards" })
      a.onfinish = () => {
        done()
        a.cancel()
      }
      el.animate([{ boxShadow: "0 0 0 0 var(--accent)" }, { boxShadow: "0 0 0 10px transparent" }], { duration: 700, delay: 380 })
    }
  }, [slug, shown, projects, origin, reduce])

  // After the sheet mounts: grow it out of the card; after a swap: slide the new project in.
  const wasOpen = useRef(false)
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!shown || !sheet) {
      wasOpen.current = false
      return
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    if (!reduce && bodyRef.current) {
      bodyRef.current.getAnimations().forEach((a) => a.cancel())
      if (wasOpen.current) {
        bodyRef.current.animate([{ opacity: 0, transform: `translateX(${40 * dir.current}px)` }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE })
      } else {
        const r = origin?.getBoundingClientRect() ?? {
          top: innerHeight / 2 - 40,
          bottom: innerHeight / 2 + 40,
          left: innerWidth / 2 - 80,
          right: innerWidth / 2 + 80,
        }
        sheet.animate([{ clipPath: clipFrom(r), opacity: 0.6 }, { clipPath: "inset(0px round 26px)", opacity: 1 }], { duration: 700, easing: EASE })
        backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450 })
        const kids = Array.from(bodyRef.current.children)
        kids.forEach((n, k) =>
          n.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], {
            duration: 600,
            delay: 260 + k * 70,
            easing: EASE,
            fill: "backwards",
          }),
        )
      }
    }
    if (!wasOpen.current) setTimeout(() => closeBtn.current?.focus(), 50)
    wasOpen.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown])

  const go = (to: string, d: 1 | -1) => {
    dir.current = d
    swapCase(to)
  }

  // Keyboard: Esc closes, arrows swap, Tab stays inside.
  useEffect(() => {
    if (!shown) return
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea/i.test((e.target as HTMLElement)?.tagName ?? "")
      if (e.key === "Escape") closeCase()
      else if (e.key === "ArrowRight" && !typing && next) go(next.slug, 1)
      else if (e.key === "ArrowLeft" && !typing && prev) go(prev.slug, -1)
      else if (e.key === "Tab" && sheetRef.current) {
        const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")).filter((x) => x.offsetParent !== null)
        if (!f.length) return
        const a = f[0]
        const z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, next, prev])

  // Swipe down on phones to dismiss.
  const sy = useRef<number | null>(null)

  if (!shown || !project) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle" style={{ "--accent": project.accent, "--accent-2": project.accent2 } as CSSProperties}>
      <div className="backdrop" ref={backdropRef} onClick={closeCase} />
      <div
        className="sheet"
        ref={sheetRef}
        style={{ "--accent": project.accent, "--accent-2": project.accent2 } as CSSProperties}
        onTouchStart={(e) => {
          sy.current = scrollRef.current?.scrollTop === 0 ? e.touches[0].clientY : null
        }}
        onTouchEnd={(e) => {
          if (sy.current !== null && e.changedTouches[0].clientY - sy.current > 110 && innerWidth <= 640) closeCase()
          sy.current = null
        }}
      >
        <div className="sheet-head">
          <div className="crumb">
            <span>Case file</span>
            <b>{project.name}</b>
          </div>
          <span className="sp" />
          <button className="icon-btn" type="button" aria-label="Previous project" onClick={() => go(prev.slug, -1)}>
            <Icon name="left" />
          </button>
          <button className="icon-btn" type="button" aria-label="Next project" onClick={() => go(next.slug, 1)}>
            <Icon name="right" />
          </button>
          <button className="icon-btn" type="button" aria-label="Close case file" ref={closeBtn} onClick={closeCase}>
            <Icon name="x" />
          </button>
        </div>
        <div className="sheet-scroll" ref={scrollRef}>
          <div className="sheet-in" ref={bodyRef}>
            <Body project={project} prev={prev} next={next} onGo={go} />
          </div>
        </div>
      </div>
    </div>
  )
}
