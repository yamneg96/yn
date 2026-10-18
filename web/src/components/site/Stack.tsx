import { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react"
import { ErrorPanel, RowsSkeleton } from "./states"
import { useStack } from "@/hooks/use-content"
import { mono } from "@/lib/format"
import type { StackLayer } from "@/lib/types"

const RINGS = [
  { count: 4, radius: 22, seconds: 60, reverse: false },
  { count: 6, radius: 35, seconds: 80, reverse: true },
  { count: 8, radius: 49, seconds: 110, reverse: false },
]

interface OrbitNode {
  name: string
  color: string
}

/** Takes one item from each layer in turn so every ring shows a mix of colours. */
function pickNodes(layers: StackLayer[], total: number): OrbitNode[] {
  const out: OrbitNode[] = []
  for (let round = 0; out.length < total; round++) {
    let added = false
    for (const l of layers) {
      if (l.items[round] && out.length < total) {
        out.push({ name: l.items[round], color: l.color })
        added = true
      }
    }
    if (!added) break
  }
  return out
}

function Orbit({ layers }: { layers: StackLayer[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const nodes = useMemo(() => pickNodes(layers, RINGS.reduce((n, r) => n + r.count, 0)), [layers])

  // Ring radii are a share of the orbit's rendered width.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const size = () => el.style.setProperty("--u", `${el.getBoundingClientRect().width}px`)
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const offsets = RINGS.map((_, i) => RINGS.slice(0, i).reduce((n, r) => n + r.count, 0))
  return (
    <div className="orbit-wrap rv">
      <div className="orbit" ref={ref} aria-label="Technology orbit">
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
        <div className="core">
          Full
          <br />
          stack
        </div>
        {RINGS.map((ring, ri) => {
          const slice = nodes.slice(offsets[ri], offsets[ri] + ring.count)
          if (!slice.length) return null
          return (
            <div className="spin" key={ri} style={{ "--t": `${ring.seconds}s`, animationDirection: ring.reverse ? "reverse" : undefined } as CSSProperties}>
              {slice.map((n, i) => (
                <div
                  className="orb"
                  key={n.name}
                  style={{ "--a": `${i * (360 / slice.length) + ri * 18}deg`, "--r": `calc(var(--u, 640px) * ${ring.radius / 100})`, "--t": `${ring.seconds}s` } as CSSProperties}
                >
                  <div className="b" style={{ animationDirection: ring.reverse ? "reverse" : undefined }}>
                    <span className="bdg" style={{ "--c": n.color } as CSSProperties} data-n={n.name}>
                      {mono(n.name)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Stack() {
  const q = useStack()
  const layers = q.data ?? []
  const marquee = layers.flatMap((l) => l.items.map((name) => ({ name, color: l.color })))

  return (
    <section className="sec" id="stack">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">
              Stack <b>/ by layer</b>
            </div>
            <h2>Everything between the screen and the database.</h2>
          </div>
          <p>Hover a node to pause the orbit. Colours match the layer list.</p>
        </div>

        {q.isPending && <RowsSkeleton rows={2} height={220} />}
        {q.isError && <ErrorPanel error={q.error} onRetry={() => q.refetch()} />}
        {q.isSuccess && layers.length === 0 && <p style={{ color: "var(--fg-3)" }}>The stack hasn’t been published yet.</p>}
        {q.isSuccess && layers.length > 0 && (
          <>
            <div className="stack-grid">
              <Orbit layers={layers} />
              <div className="cats rv">
                {layers.map((l) => (
                  <div className="cat" key={l.id} style={{ "--c": l.color } as CSSProperties}>
                    <i />
                    <h4>{l.name}</h4>
                    <p>{l.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="marq" aria-hidden="true">
              <div className="track">
                {[...marquee, ...marquee].map((n, i) => (
                  <span className="tk" key={`${n.name}-${i}`} style={{ "--c": n.color } as CSSProperties}>
                    <span className="led" style={{ background: n.color }} />
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
