import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { Icon } from "./Icon"
import { CoverArt } from "./Cover"
import { ErrorPanel } from "./states"
import { useProjects, useSettings, useSocialLinks } from "@/hooks/use-content"
import { useClock, useCountUp, useReducedMotion, useTypewriter } from "@/hooks/use-ui"
import { ParticleStage, sceneFor } from "@/lib/particles"
import { hexToRgb, hostOf, pad2, splitHighlight } from "@/lib/format"
import type { Metric, Project, SiteSettings } from "@/lib/types"
import { useUiStore } from "@/stores/ui"

const SLIDE_MS = 7000
const MAX_CHANNELS = 5

/** Everything about the page that follows the active channel: accent colours and glow. */
function accentStyle(p: Project | undefined): CSSProperties {
  if (!p) return {}
  const [r, g, b] = hexToRgb(p.accent)
  return { "--accent": p.accent, "--accent-2": p.accent2, "--glow": `rgba(${r},${g},${b},.38)` } as CSSProperties
}

function ParticleCanvas({ project }: { project: Project | undefined }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const stage = useRef<ParticleStage | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = new ParticleStage(canvas)
    stage.current = s
    const onResize = () => s.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      s.destroy()
      stage.current = null
    }
  }, [])

  const art = project?.art
  const accent = project?.accent
  useEffect(() => {
    if (stage.current && art && accent) stage.current.set(sceneFor(art), accent)
  }, [art, accent])

  return <canvas id="fx" ref={ref} />
}

function Stat({ metric, started }: { metric: Metric; started: boolean }) {
  const value = useCountUp(metric.value, started)
  return (
    <div className="stat">
      <b>
        {value}
        {metric.suffix}
      </b>
      <span>{metric.label}</span>
    </div>
  )
}

function Stats({ stats }: { stats: Metric[] }) {
  const reduce = useReducedMotion()
  const [started, setStarted] = useState(reduce)
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setStarted(true), 1000)
    return () => clearTimeout(t)
  }, [reduce])
  if (!stats.length) return null
  return (
    <div className="stats">
      {stats.map((m) => (
        <Stat key={m.label} metric={m} started={started} />
      ))}
    </div>
  )
}

function RoleLine({ roles }: { roles: string[] }) {
  const text = useTypewriter(roles)
  if (!roles.length) return null
  return (
    <div className="roleline" aria-live="off">
      <span className="prompt">&gt;</span>
      <span>{text}</span>
      <i className="caret" />
    </div>
  )
}

/** Slideshow state: autoplay with a per-channel progress bar, paused on hover/focus/hidden/modal. */
function useSlideshow(count: number, paused: boolean, heroVisible: boolean) {
  const [idx, setIdx] = useState(0)
  const bar = useRef<HTMLElement | null>(null)
  const elapsed = useRef(0)
  const go = useCallback(
    (i: number) => {
      if (!count) return
      elapsed.current = 0
      bar.current?.style.setProperty("--p", "0")
      setIdx(((i % count) + count) % count)
    },
    [count]
  )
  const idxRef = useRef(idx)
  useEffect(() => {
    idxRef.current = idx
  }, [idx])

  useEffect(() => {
    if (count < 2) return
    let raf = 0
    let last = performance.now()
    const loop = (t: number) => {
      const d = t - last
      last = t
      const modalOpen = useUiStore.getState().caseSlug !== null
      if (!paused && heroVisible && !document.hidden && !modalOpen) {
        elapsed.current += d
        bar.current?.style.setProperty("--p", String(Math.min(1, elapsed.current / SLIDE_MS)))
        if (elapsed.current >= SLIDE_MS) go(idxRef.current + 1)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [count, paused, heroVisible, go])

  return { idx: count ? Math.min(idx, count - 1) : 0, go, bar }
}

function HeroBody({ s, projects }: { s: SiteSettings; projects: Project[] }) {
  const reduce = useReducedMotion()
  const featuredAll = projects.filter((p) => p.featured)
  const featured = (featuredAll.length ? featuredAll : projects).slice(0, MAX_CHANNELS)
  const heroRef = useRef<HTMLElement | null>(null)
  const [hover, setHover] = useState(false)
  const [userPaused, setUserPaused] = useState(reduce)
  const [visible, setVisible] = useState(true)
  const [manual, setManual] = useState(false)
  const { idx, go, bar } = useSlideshow(featured.length, userPaused || hover, visible)
  const current: Project | undefined = featured[idx]
  const clock = useClock(s.timezone)
  const social = useSocialLinks().data ?? []
  const github = social.find((l) => /github/i.test(l.platform))
  const linkedin = social.find((l) => /linkedin/i.test(l.platform))
  const openCase = useUiStore((st) => st.openCase)

  // Pause when the hero is off screen.
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const io = new IntersectionObserver((e) => setVisible(e[0].isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Arrow keys switch channels while the hero is on screen and no case file is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (useUiStore.getState().caseSlug || /input|textarea|select/i.test((document.activeElement as HTMLElement)?.tagName ?? "")) return
      const r = heroRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > innerHeight) return
      if (e.key === "ArrowLeft") {
        setManual(true)
        go(idx - 1)
      } else if (e.key === "ArrowRight") {
        setManual(true)
        go(idx + 1)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [go, idx])

  const touchX = useRef<number | null>(null)
  const [before, highlight, after] = splitHighlight(s.heroTitle, s.heroHighlight)
  const live = manual || userPaused ? "polite" : "off"

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      aria-roledescription="carousel"
      aria-label="Featured systems"
      aria-live={live}
      style={accentStyle(current)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 60) {
          setManual(true)
          go(idx + (dx < 0 ? 1 : -1))
        }
        touchX.current = null
      }}
    >
      <div className="hero-bg" aria-hidden="true">
        <div className="grid" />
        <i className="blob b1" />
        <i className="blob b2" />
        <i className="blob b3" />
        <ParticleCanvas project={current} />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="ident">
              <div className="avatar" aria-hidden={!s.heroImageUrl}>
                {s.heroImageUrl ? <img src={s.heroImageUrl} alt={s.fullName} /> : s.initials}
              </div>
              <div className="ident-meta">
                <strong>{s.fullName}</strong>
                <span>
                  ሰላም · {s.location.toUpperCase()} {s.coordinates} · <span className="clock">{clock}</span> {s.timezoneLabel}
                </span>
              </div>
              {s.availability && (
                <div className="avail">
                  <span className="led" style={s.available ? undefined : { background: "var(--fg-3)", animation: "none" }} />
                  {s.availability}
                </div>
              )}
            </div>

            <h1>
              {before}
              {highlight && <em className="grad">{highlight}</em>}
              {after}
            </h1>
            <RoleLine roles={s.heroRoles} />
            <p className="lede">{s.heroSubtitle}</p>

            <div className="hero-cta">
              <a className="btn btn-primary" href="#projects">
                View my work <Icon name="arrow" className="nudge" />
              </a>
              {s.resumeUrl && (
                <a className="btn btn-ghost" href={s.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Download résumé <Icon name="down" />
                </a>
              )}
              {(github || linkedin) && <span className="sep" aria-hidden="true" />}
              {github && (
                <a className="icon-btn" href={github.url} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
                  </svg>
                </a>
              )}
              {linkedin && (
                <a className="icon-btn" href={linkedin.url} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
                  </svg>
                </a>
              )}
            </div>

            <Stats stats={s.stats} />
          </div>

          {current && (
            <div className="feed">
              <div className="monitor">
                <div className="mon-bar">
                  <span className="ch">CH {pad2(idx + 1)}</span>
                  <span>{current.name.toUpperCase()}</span>
                  <span className="rec">
                    <span className="led" style={{ background: "var(--accent)" }} />
                    LIVE FEED
                  </span>
                </div>
                <div className="mon-body">
                  <div className="art feed-swap" key={current.slug}>
                    <CoverArt project={current} big />
                  </div>
                </div>
                <div className="mon-foot">
                  <span className="host">{hostOf(current.liveUrl ?? current.sourceUrl ?? "")}</span>
                  <span>{current.kind.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {current && (
          <div className="deck">
            <div className="now">
              <div className="label">
                <span className="led" />
                Now showing
              </div>
              <h2 className="now-title" key={`t-${current.slug}`}>
                <span>{current.title}</span>
              </h2>
              <p className="now-desc" key={`d-${current.slug}`}>
                <span>{current.summary}</span>
              </p>
              <button className="now-link" type="button" onClick={(e) => openCase(current.slug, e.currentTarget)}>
                Open case file <Icon name="up-right" />
              </button>
            </div>
            <div className="chan">
              <div className="ticks" role="tablist" aria-label="Channels">
                {featured.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    className="tick"
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={`Channel ${i + 1}: ${p.name}`}
                    ref={i === idx ? (el) => void (bar.current = el) : undefined}
                    onClick={() => {
                      setManual(true)
                      go(i)
                    }}
                  >
                    <span>{pad2(i + 1)}</span>
                    <i />
                  </button>
                ))}
              </div>
              <div className="chan-ctl">
                <button className="icon-btn" type="button" aria-label="Previous channel" onClick={() => { setManual(true); go(idx - 1) }}>
                  <Icon name="left" />
                </button>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                  aria-pressed={userPaused}
                  onClick={() => setUserPaused((v) => !v)}
                >
                  <Icon name={userPaused ? "play" : "pause"} />
                </button>
                <button className="icon-btn" type="button" aria-label="Next channel" onClick={() => { setManual(true); go(idx + 1) }}>
                  <Icon name="right" />
                </button>
                <span className="count">
                  {pad2(idx + 1)} / {pad2(featured.length)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function HeroSkeleton() {
  return (
    <section className="hero" id="hero" aria-busy="true" aria-label="Loading">
      <div className="hero-bg" aria-hidden="true">
        <div className="grid" />
        <i className="blob b1" />
        <i className="blob b2" />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div style={{ display: "grid", gap: 18 }}>
            <div className="sk" style={{ height: 64, width: 280, borderRadius: 18 }} />
            <div className="sk" style={{ height: 72, width: "90%" }} />
            <div className="sk" style={{ height: 72, width: "70%" }} />
            <div className="sk" style={{ height: 16, width: "55%" }} />
            <div className="sk" style={{ height: 48, width: 260, borderRadius: 10 }} />
          </div>
          <div className="sk" style={{ aspectRatio: "16 / 11", borderRadius: 14 }} />
        </div>
      </div>
    </section>
  )
}

export function Hero() {
  const settings = useSettings()
  const projects = useProjects()
  if (settings.isPending) return <HeroSkeleton />
  if (settings.isError)
    return (
      <section className="hero" id="hero">
        <div className="wrap" style={{ paddingBlock: 40 }}>
          <ErrorPanel title="Couldn’t load the page" error={settings.error} onRetry={() => settings.refetch()} />
        </div>
      </section>
    )
  return <HeroBody s={settings.data} projects={projects.data ?? []} />
}
