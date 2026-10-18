import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react"
import { Icon } from "./Icon"
import { CoverArt } from "./Cover"
import { hostOf, pathOf } from "@/lib/format"
import { mockPhoneSvg, mockWebSvg, coverSvg } from "@/lib/art"
import type { Project } from "@/lib/types"

/* ---------------------------------------------------------------------------
   A small, real browser inside the case file. The deployed site loads in an
   iframe that is scaled to a fixed "logical" device width, so a 1280px desktop
   layout fits the modal. The frame only exists while the case file is open.
--------------------------------------------------------------------------- */

const LOGICAL_WIDTH = { desktop: 1280, tablet: 820, phone: 390 } as const
type Device = keyof typeof LOGICAL_WIDTH

const DEVICES: { key: Device; label: string; icon: "monitor" | "tablet" | "phone" }[] = [
  { key: "desktop", label: "Desktop size", icon: "monitor" },
  { key: "tablet", label: "Tablet size", icon: "tablet" },
  { key: "phone", label: "Phone size", icon: "phone" },
]

interface Fit {
  width: number
  height: number
  scale: number
  left: number
  top: number
}

function LiveBrowser({ project, active }: { project: Project; active: boolean }) {
  const url = project.liveUrl!
  const usable = project.embedMode === "live"
  const host = hostOf(url)
  const [device, setDevice] = useState<Device>("desktop")
  const [enlarged, setEnlarged] = useState(false)
  const [started, setStarted] = useState(active)
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [fit, setFit] = useState<Fit | null>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  // Load the site the first time this tab is shown.
  if (active && !started) setStarted(true)
  const src = started && usable ? url : undefined

  // "Taking longer than usual" hint.
  useEffect(() => {
    if (!src || loaded) return
    const t = setTimeout(() => setSlow(true), 9000)
    return () => clearTimeout(t)
  }, [src, loaded, reloadKey])

  // Scale the logical device width into the view.
  useLayoutEffect(() => {
    const view = viewRef.current
    if (!view || !usable) return
    const measure = () => {
      const W = view.clientWidth
      const H = view.clientHeight
      const lw = LOGICAL_WIDTH[device]
      const pad = device === "desktop" ? 0 : 18
      const scale = Math.min(1, (W - pad * 2) / lw)
      setFit({ width: lw, height: (H - pad * 2) / scale, scale, left: Math.max(0, (W - lw * scale) / 2), top: pad })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(view)
    return () => ro.disconnect()
  }, [device, usable, active])

  const path = pathOf(url)

  return (
    <div className={`browser${enlarged ? " big" : ""}`} data-dev={device}>
      <div className="b-chrome">
        <span className="b-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {usable && (
          <button
            type="button"
            className="b-btn"
            aria-label="Reload the page"
            onClick={() => {
              setLoaded(false)
              setSlow(false)
              setReloadKey((k) => k + 1)
            }}
          >
            <Icon name="reload" />
          </button>
        )}
        <div className="b-url" title={url}>
          <Icon name="lock" />
          <span className="b-host">{host}</span>
          <span className="b-path">{path}</span>
        </div>
        {usable && (
          <>
            <div className="b-dev" role="group" aria-label="Preview size">
              {DEVICES.map((d) => (
                <button key={d.key} type="button" data-dev={d.key} aria-pressed={device === d.key} aria-label={d.label} onClick={() => setDevice(d.key)}>
                  <Icon name={d.icon} />
                </button>
              ))}
            </div>
            <button type="button" className="b-btn" aria-pressed={enlarged} aria-label="Enlarge the browser" onClick={() => setEnlarged((v) => !v)}>
              <Icon name="expand" />
            </button>
          </>
        )}
        <a className="b-btn" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${host} in a new tab`}>
          <Icon name="up-right" />
        </a>
      </div>

      {usable ? (
        <>
          <div className="b-view" ref={viewRef}>
            <div className={`b-load${loaded ? " done" : ""}`}>
              <span className="ring" />
              <div className="ld">
                <b>Loading {host}</b>
                <small>{slow ? "Taking longer than usual. You can open it in a new tab." : "The real deployed site, not a screenshot"}</small>
              </div>
            </div>
            <div
              className="b-stage"
              style={fit ? { width: fit.width, height: fit.height, transform: `scale(${fit.scale})`, left: fit.left, top: fit.top } : undefined}
            >
              {src && (
                <iframe
                  key={reloadKey}
                  title={`Live preview of ${project.name}`}
                  src={src}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  referrerPolicy="no-referrer"
                  onLoad={() => {
                    setLoaded(true)
                    setSlow(false)
                  }}
                />
              )}
            </div>
          </div>
          <div className={`b-foot${slow && !loaded ? " warn" : ""}`}>
            <span>Interactive: click, scroll and type inside the page.</span>
            <span>
              Blank or stuck?{" "}
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open in a new tab ↗
              </a>
            </span>
          </div>
        </>
      ) : (
        <div className="b-view">
          <div className="b-fallback">
            <div className="b-fb-art">
              <CoverArt project={project} />
            </div>
            <div className="b-fb-msg">
              <span className="ico">
                <Icon name="alert" />
              </span>
              <h3>{project.embedMode === "down" ? "This site is down right now" : "This site can’t be shown here"}</h3>
              <p>
                {project.embedMode === "down" ? (
                  <>
                    <b>{host}</b> is returning <code>{project.embedNote || "an error"}</code> right now, so there is nothing to show yet.
                  </>
                ) : (
                  <>
                    <b>{host}</b> sends <code>{project.embedNote || "a header that blocks framing"}</code>, which tells browsers not to show it inside another page.
                  </>
                )}
              </p>
              <a className="btn btn-primary" href={url} target="_blank" rel="noopener noreferrer">
                Open the live site <Icon name="up-right" />
              </a>
              <p className="fix">
                {project.embedMode === "down" ? (
                  "Check the deployment, then switch this project back to “Show live site” in the CMS."
                ) : (
                  <>
                    Fix: add <code>frame-ancestors {window.location.origin}</code> to that project’s Content-Security-Policy to allow this portfolio to embed it.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ArtCarousel({ project }: { project: Project }) {
  const [i, setI] = useState(0)
  const touchX = useRef<number | null>(null)
  const slides = [
    project.coverImageUrl ? null : coverSvg(project, true),
    mockWebSvg(project),
    mockPhoneSvg(project),
  ]
  const n = slides.length
  const to = (k: number) => setI(((k % n) + n) % n)
  return (
    <div
      className="carousel"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) to(i + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="slides" style={{ transform: `translateX(${-100 * i}%)` }}>
        {slides.map((svg, k) => (
          <div className="slide" key={k}>
            {svg ? (
              <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
              <CoverArt project={project} big />
            )}
          </div>
        ))}
      </div>
      <div className="car-ctl">
        <div className="dots">
          {slides.map((_, k) => (
            <button key={k} type="button" aria-label={`Slide ${k + 1}`} aria-current={k === i} onClick={() => to(k)} />
          ))}
        </div>
        <div className="car-btns">
          <button className="icon-btn" type="button" aria-label="Previous slide" onClick={() => to(i - 1)}>
            <Icon name="left" />
          </button>
          <button className="icon-btn" type="button" aria-label="Next slide" onClick={() => to(i + 1)}>
            <Icon name="right" />
          </button>
        </div>
      </div>
    </div>
  )
}

/** Live site + artwork tabs. Projects without a deployment open straight on the artwork. */
export function MediaPanel({ project }: { project: Project }) {
  const hasLive = Boolean(project.liveUrl)
  const [tab, setTab] = useState<"live" | "art">(hasLive ? "live" : "art")
  const tabs: ("live" | "art")[] = hasLive ? ["live", "art"] : ["art"]

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, k: "live" | "art") => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    e.stopPropagation()
    const next = tabs[(tabs.indexOf(k) + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]
    setTab(next)
    document.getElementById(next === "live" ? "tabLive" : "tabArt")?.focus()
  }

  return (
    <div className="m-media">
      <div className="media-tabs" role="tablist" aria-label="Project media">
        {hasLive && (
          <button type="button" role="tab" id="tabLive" aria-selected={tab === "live"} aria-controls="panelLive" onClick={() => setTab("live")} onKeyDown={(e) => onKey(e, "live")}>
            <Icon name="globe" />
            Live site
          </button>
        )}
        <button type="button" role="tab" id="tabArt" aria-selected={tab === "art"} aria-controls="panelArt" onClick={() => setTab("art")} onKeyDown={(e) => onKey(e, "art")}>
          <Icon name="img" />
          Artwork
        </button>
        <span className="tabs-note">{hasLive ? `Loaded from ${hostOf(project.liveUrl!)}` : "Source only · no live deployment"}</span>
      </div>
      {hasLive && (
        <div className="tabpanel" id="panelLive" role="tabpanel" aria-labelledby="tabLive" hidden={tab !== "live"}>
          <LiveBrowser project={project} active={tab === "live"} />
        </div>
      )}
      <div className="tabpanel" id="panelArt" role="tabpanel" aria-labelledby="tabArt" hidden={tab !== "art"}>
        <ArtCarousel project={project} />
      </div>
    </div>
  )
}
