import type { ReactNode } from "react"
import { Icon } from "./Icon"
import { ApiError } from "@/lib/api"

/** Skeleton cards shown while projects load (matches the real card footprint). */
export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div className="skel" key={i} aria-hidden="true">
          <div className="sk sk-cover" />
          <div className="sk-body">
            <div className="sk" style={{ height: 10, width: "30%" }} />
            <div className="sk" style={{ height: 22, width: "72%" }} />
            <div className="sk" style={{ height: 12, width: "100%" }} />
            <div className="sk" style={{ height: 12, width: "80%" }} />
          </div>
        </div>
      ))}
    </>
  )
}

/** Generic block skeleton for sections whose real layout is a stack of rows. */
export function RowsSkeleton({ rows = 3, height = 120 }: { rows?: number; height?: number }) {
  return (
    <div style={{ display: "grid", gap: 14 }} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div className="sk" key={i} style={{ height, borderRadius: 16 }} />
      ))}
    </div>
  )
}

interface PanelProps {
  title: string
  message: string
  action?: ReactNode
}

export function EmptyPanel({ title, message, action }: PanelProps) {
  return (
    <div className="panel-state" style={{ gridColumn: "1 / -1" }}>
      <span className="ico">
        <Icon name="inbox" size={24} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}

export function ErrorPanel({
  title = "Couldn’t load this section",
  error,
  onRetry,
}: {
  title?: string
  error?: unknown
  onRetry?: () => void
}) {
  const message =
    error instanceof ApiError ? error.message : "The server didn’t respond. Check your connection and try again. Nothing on this page has been lost."
  return (
    <div className="panel-state err" role="alert" style={{ gridColumn: "1 / -1" }}>
      <span className="ico">
        <Icon name="alert" size={24} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-ghost" type="button" onClick={onRetry}>
          Try again <Icon name="loop" />
        </button>
      )}
    </div>
  )
}
