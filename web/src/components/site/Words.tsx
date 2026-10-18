import { ErrorPanel, RowsSkeleton } from "./states"
import { useTestimonials } from "@/hooks/use-content"
import type { Testimonial } from "@/lib/types"

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
}

/** Repeats a short list so the marquee track is always wider than the screen. */
function fill(items: Testimonial[]) {
  const out: Testimonial[] = []
  while (out.length < 8) out.push(...items)
  return [...out, ...out]
}

function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div className="marq-wrap">
      <div className={`track${reverse ? " rev" : ""}`}>
        {fill(items).map((t, i) => (
          <article className="q" key={`${t.id}-${i}`} aria-hidden={i >= items.length ? true : undefined}>
            <p>“{t.quote}”</p>
            <footer>
              {t.avatarUrl ? (
                <img className="av" src={t.avatarUrl} alt="" width={40} height={40} loading="lazy" style={{ objectFit: "cover" }} />
              ) : (
                <span className="av">{initialsOf(t.name)}</span>
              )}
              <span>
                <b>{t.name}</b>
                {t.role && <small>{t.role}</small>}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  )
}

export function Words() {
  const q = useTestimonials()
  const items = q.data ?? []
  return (
    <section className="sec" id="words">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">Testimonials</div>
            <h2>What collaborators say.</h2>
          </div>
          <p>Words from the people who worked alongside me. Hover to pause.</p>
        </div>
        {q.isPending && <RowsSkeleton rows={1} height={160} />}
        {q.isError && <ErrorPanel error={q.error} onRetry={() => q.refetch()} />}
        {q.isSuccess && items.length === 0 && <p style={{ color: "var(--fg-3)" }}>No testimonials yet.</p>}
      </div>
      {q.isSuccess && items.length > 0 && (
        <div className="quotes">
          <Row items={items} />
          <Row items={[...items].reverse()} reverse />
        </div>
      )}
    </section>
  )
}
