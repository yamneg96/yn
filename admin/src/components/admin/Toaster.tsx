import { useEffect } from "react"
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
import { useToastStore, type Toast } from "@/stores/toast"
import { cn } from "@/lib/utils"

const ICONS = { success: CheckCircle2Icon, error: AlertCircleIcon, info: InfoIcon }
const TONE = { success: "text-success", error: "text-destructive", info: "text-primary" }

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss)
  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), toast.kind === "error" ? 6000 : 3500)
    return () => clearTimeout(t)
  }, [toast.id, toast.kind, dismiss])
  const Icon = ICONS[toast.kind]
  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      className="flex max-w-sm items-start gap-2.5 rounded-xl border bg-popover px-3.5 py-3 text-sm text-popover-foreground shadow-lg animate-in fade-in-0 slide-in-from-right-4"
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", TONE[toast.kind])} />
      <span className="min-w-0 break-words">{toast.message}</span>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[100] grid gap-2 [&>*]:pointer-events-auto" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
