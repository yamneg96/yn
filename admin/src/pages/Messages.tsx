import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ArchiveIcon, ArchiveRestoreIcon, ArrowLeftIcon, CheckCheckIcon, CopyIcon, MailOpenIcon, ReplyIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState, ErrorState, ListSkeleton, PageHeader } from "@/components/admin/states"
import { useMessageActions, useMessages } from "@/hooks/use-admin"
import { fullDate, timeAgo, TOPIC_LABEL } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Message, MessageStatus } from "@/lib/types"
import { toast } from "@/stores/toast"

const FILTERS: { key: MessageStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "archived", label: "Archived" },
]

function Detail({ message, onBack }: { message: Message; onBack: () => void }) {
  const { setStatus, remove } = useMessageActions()
  const [confirm, setConfirm] = useState(false)
  const subject = encodeURIComponent(`Re: your message on my portfolio (${TOPIC_LABEL[message.topic]})`)
  const quoted = encodeURIComponent(`\n\n— On ${fullDate(message.createdAt)}, ${message.name} wrote:\n> ${message.message.replace(/\n/g, "\n> ")}`)

  return (
    <article className="grid gap-5 rounded-xl border bg-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onBack}>
          <ArrowLeftIcon /> Inbox
        </Button>
      </div>
      <header className="grid gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-xl font-semibold">{message.name}</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{TOPIC_LABEL[message.topic]}</span>
          {message.status === "new" && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">New</span>}
        </div>
        <a href={`mailto:${message.email}`} className="w-fit text-sm text-primary hover:underline">
          {message.email}
        </a>
        <p className="text-xs text-muted-foreground">
          {fullDate(message.createdAt)} · {timeAgo(message.createdAt)}
        </p>
      </header>

      <p className="text-[0.95rem] leading-relaxed break-words whitespace-pre-wrap">{message.message}</p>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button nativeButton={false} render={<a href={`mailto:${message.email}?subject=${subject}&body=${quoted}`} />}>
          <ReplyIcon /> Reply by email
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            navigator.clipboard
              .writeText(message.email)
              .then(() => toast.success("Email copied"))
              .catch(() => toast.info("Select the address to copy it"))
          }
        >
          <CopyIcon /> Copy email
        </Button>
        {message.status === "read" || message.status === "archived" ? (
          <Button variant="outline" onClick={() => setStatus.mutate({ id: message.id, status: "new" })}>
            <MailOpenIcon /> Mark unread
          </Button>
        ) : null}
        {message.status === "archived" ? (
          <Button variant="outline" onClick={() => setStatus.mutate({ id: message.id, status: "read" })}>
            <ArchiveRestoreIcon /> Restore
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setStatus.mutate({ id: message.id, status: "archived" })}>
            <ArchiveIcon /> Archive
          </Button>
        )}
        <Button variant="destructive" className="ml-auto" onClick={() => setConfirm(true)}>
          <Trash2Icon /> Delete
        </Button>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Delete this message?"
        description={`The message from ${message.name} will be removed permanently.`}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false)
          remove.mutate(message.id, { onSuccess: onBack })
        }}
      />
    </article>
  )
}

export function Messages() {
  const [params, setParams] = useSearchParams()
  const filter = (params.get("status") as MessageStatus | "all" | null) ?? "all"
  const openId = params.get("open")
  const q = useMessages(filter)
  const { setStatus, readAll } = useMessageActions()

  const items = q.data?.items ?? []
  const found = items.find((m) => m.id === openId) ?? null
  // Keep showing a message that just left the current filter (e.g. a "new" message that was auto-marked read).
  const [held, setHeld] = useState<Message | null>(null)
  if (found && held !== found) setHeld(found)
  const selected = found ?? (held && held.id === openId ? held : null)

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v === null) p.delete(k)
      else p.set(k, v)
    }
    setParams(p, { replace: true })
  }

  // Opening a new message marks it read.
  useEffect(() => {
    if (found?.status === "new") setStatus.mutate({ id: found.id, status: "read" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found?.id])

  return (
    <>
      <PageHeader
        title="Messages"
        description="Requests sent from the contact form on your portfolio."
        actions={
          <Button variant="outline" disabled={!q.data?.unread || readAll.isPending} onClick={() => readAll.mutate()}>
            <CheckCheckIcon /> Mark all read
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter messages">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => update({ status: f.key === "all" ? null : f.key, open: null })}
            className={cn("rounded-full border px-3 py-1 text-sm transition-colors", filter === f.key ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}
          >
            {f.label}
            {f.key === "new" && (q.data?.unread ?? 0) > 0 && <span className="ml-1.5 text-xs font-semibold">{q.data?.unread}</span>}
          </button>
        ))}
      </div>

      {q.isPending && <ListSkeleton rows={5} height="h-16" />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && items.length === 0 && (
        <EmptyState title={filter === "all" ? "No messages yet" : `No ${filter} messages`} message="When someone sends a request through the portfolio contact form, it shows up here." />
      )}
      {q.isSuccess && items.length > 0 && (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <ul className={cn("grid gap-2", selected && "hidden lg:grid")}>
            {items.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => update({ open: m.id })}
                  aria-current={selected?.id === m.id}
                  className={cn(
                    "grid w-full gap-0.5 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-accent",
                    selected?.id === m.id && "border-primary/60 bg-accent",
                    m.status === "archived" && "opacity-70"
                  )}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2">
                      {m.status === "new" && <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                      <span className={cn("truncate text-sm", m.status === "new" ? "font-semibold" : "font-medium")}>{m.name}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{TOPIC_LABEL[m.topic]}</span>
                  <span className="line-clamp-2 text-sm text-muted-foreground">{m.message}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={cn(!selected && "hidden lg:block")}>
            {selected ? (
              <Detail key={selected.id} message={selected} onBack={() => update({ open: null })} />
            ) : (
              <div className="hidden rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground lg:block">Select a message to read it.</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
