import { useEffect, useState } from "react"
import { Icon } from "./Icon"
import { useToastStore, type Toast } from "@/stores/toast"

const ICONS = { ok: "check", er: "alert", inf: "info" } as const

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const [out, setOut] = useState(false)

  useEffect(() => {
    const leave = setTimeout(() => setOut(true), 3600)
    const remove = setTimeout(() => dismiss(toast.id), 3950)
    return () => {
      clearTimeout(leave)
      clearTimeout(remove)
    }
  }, [toast.id, dismiss])

  return (
    <div className={`toast ${toast.kind}${out ? " out" : ""}`} role={toast.kind === "er" ? "alert" : "status"}>
      <Icon name={ICONS[toast.kind]} />
      <span>{toast.message}</span>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
