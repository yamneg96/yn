import { useProjects } from "@/hooks/use-content"
import { hostOf } from "@/lib/format"

/** A slow marquee of the systems that are live right now. */
export function Ticker() {
  const { data } = useProjects()
  const live = (data ?? []).filter((p) => p.liveUrl)
  if (!live.length) return null
  const items = [...live, ...live]
  return (
    <div className="ticker" aria-label="Systems currently live">
      <div className="track">
        {items.map((p, i) => (
          <span className="tk" key={`${p.slug}-${i}`}>
            <span className="led" />
            <b>{p.name}</b>
            {hostOf(p.liveUrl!)}
          </span>
        ))}
      </div>
    </div>
  )
}
