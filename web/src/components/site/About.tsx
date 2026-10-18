import { useCallback, type PointerEvent } from "react"
import { Icon } from "./Icon"
import { ErrorPanel, RowsSkeleton } from "./states"
import { useSettings } from "@/hooks/use-content"
import { copyEmail } from "@/lib/clipboard"
import type { SiteSettings } from "@/lib/types"

/** Updates --mx/--my so the tile's cursor spotlight follows the pointer. */
function useSpotlight() {
  return useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }, [])
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="chips">
      {items.map((t) => (
        <span className="chip" key={t}>
          {t}
        </span>
      ))}
    </div>
  )
}

function Bento({ s }: { s: SiteSettings }) {
  const spot = useSpotlight()
  return (
    <div className="bento">
      <article className="tile t1 rv" onPointerMove={spot}>
        <span className="k">Operating principle</span>
        <p className="big">{s.principle}</p>
        <div className="quote-meta">
          {s.principleTags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </article>

      <article className="tile t2 rv" onPointerMove={spot}>
        <span className="k">Based in {s.location}</span>
        <div className="globe">
          <svg viewBox="0 0 108 108" aria-hidden="true">
            <circle cx="54" cy="54" r="50" fill="none" stroke="var(--line-2)" />
            <g fill="none" stroke="var(--cyan)" strokeOpacity=".6">
              <ellipse className="mer" cx="54" cy="54" rx="50" ry="50" />
              <ellipse className="mer" cx="54" cy="54" rx="50" ry="50" />
              <ellipse className="mer" cx="54" cy="54" rx="50" ry="50" />
            </g>
            <path d="M4 54h100M10 32h88M10 76h88" stroke="var(--line-2)" fill="none" />
            <circle className="pin" cx="62" cy="46" r="3" fill="var(--amber)" />
            <circle cx="62" cy="46" r="3" fill="var(--amber)" />
          </svg>
          <div>
            <h3>Flexible across time zones.</h3>
            <p style={{ marginTop: 6 }}>{s.timezoneNote}</p>
          </div>
        </div>
      </article>

      <article className="tile t3 rv" onPointerMove={spot}>
        <span className="k">Daily stack</span>
        <Chips items={s.dailyStack} />
      </article>

      <article className="tile t4 rv" onPointerMove={spot}>
        <span className="k">Always learning</span>
        <h3>{s.learningNote}</h3>
      </article>

      <article className="tile t5 rv" onPointerMove={spot}>
        <span className="k">The inside scoop</span>
        <h3>{s.insideScoop}</h3>
        <div className="chips">
          {s.scoopSince && (
            <span className="chip">
              <span className="led" style={{ width: 6, height: 6 }} />
              {s.scoopSince}
            </span>
          )}
          {s.scoopRole && <span className="chip">{s.scoopRole}</span>}
        </div>
      </article>

      <article className="tile t6 rv" onPointerMove={spot}>
        <span className="k">Start a project</span>
        <h3>{s.ctaHeading}</h3>
        {s.email && (
          <div className="copy-row">
            <button className="btn btn-primary" type="button" onClick={(e) => copyEmail(s.email!, e.currentTarget)}>
              <Icon name="copy" />
              <span>Copy email</span>
            </button>
            <span className="email">{s.email}</span>
          </div>
        )}
      </article>
    </div>
  )
}

export function About() {
  const q = useSettings()
  return (
    <section className="sec" id="about">
      <div className="wrap">
        {q.isPending && <RowsSkeleton rows={2} height={180} />}
        {q.isError && <ErrorPanel error={q.error} onRetry={() => q.refetch()} />}
        {q.isSuccess && (
          <>
            <div className="sec-head rv">
              <div>
                <div className="eyebrow">
                  About <b>/ how I work</b>
                </div>
                <h2>{q.data.aboutHeading}</h2>
              </div>
              <p>{q.data.aboutIntro}</p>
            </div>
            <Bento s={q.data} />
          </>
        )}
      </div>
    </section>
  )
}
