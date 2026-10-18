import { useCallback, type CSSProperties, type PointerEvent } from "react"
import { Icon } from "./Icon"
import { ErrorPanel, RowsSkeleton } from "./states"
import { useApproach } from "@/hooks/use-content"

export function Approach() {
  const q = useApproach()
  const steps = q.data ?? []
  const spot = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }, [])

  return (
    <section className="sec" id="approach">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">
              Approach <b>/ four phases</b>
            </div>
            <h2>How a system gets from idea to production.</h2>
          </div>
          <p>The same four phases on a one-week MVP or a multi-app platform. Hover a card.</p>
        </div>
        {q.isPending && <RowsSkeleton rows={1} height={220} />}
        {q.isError && <ErrorPanel error={q.error} onRetry={() => q.refetch()} />}
        {q.isSuccess && steps.length === 0 && <p style={{ color: "var(--fg-3)" }}>The approach hasn’t been published yet.</p>}
        {q.isSuccess && steps.length > 0 && (
          <div className="phases">
            {steps.map((s, i) => (
              <article className="phase" key={s.id} style={{ "--c": s.color } as CSSProperties} onPointerMove={spot}>
                <div className="phase-top">
                  <span className="p-no">PHASE {String(i + 1).padStart(2, "0")}</span>
                  <span className="p-ic">
                    <Icon name={s.icon} size={22} />
                  </span>
                </div>
                <div>
                  <h3>{s.title}</h3>
                  <p style={{ marginTop: 10 }}>{s.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
