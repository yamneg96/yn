import { Link } from "react-router-dom"
import { ArrowUpRightIcon, MailIcon } from "lucide-react"
import { EmptyState, ErrorState, ListSkeleton, PageHeader } from "@/components/admin/states"
import { useMessages, useOverview } from "@/hooks/use-admin"
import { timeAgo, TOPIC_LABEL } from "@/lib/format"

const HREF: Record<string, string> = {
  settings: "/settings",
  projects: "/projects",
  experience: "/experience",
  approach: "/approach",
  stack: "/stack",
  testimonials: "/testimonials",
  socialLinks: "/social-links",
  messages: "/messages",
}

function RecentMessages() {
  const q = useMessages("new")
  const items = q.data?.items.slice(0, 5) ?? []
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">Unread messages</h2>
        <Link to="/messages" className="text-sm text-primary hover:underline">
          Open inbox
        </Link>
      </div>
      {q.isPending && <ListSkeleton rows={3} height="h-16" />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && items.length === 0 && <EmptyState title="Inbox zero" message="No new requests from the portfolio contact form." />}
      {q.isSuccess && items.length > 0 && (
        <ul className="grid gap-2">
          {items.map((m) => (
            <li key={m.id}>
              <Link to={`/messages?open=${m.id}`} className="flex items-start gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-accent">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <MailIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium">{m.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    <span className="text-foreground/70">{TOPIC_LABEL[m.topic]}</span> · {m.message}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function Dashboard() {
  const q = useOverview()
  return (
    <>
      <PageHeader title="Dashboard" description="Everything the public portfolio shows is managed here. Changes go live as soon as you save." />
      {q.isPending && <ListSkeleton rows={2} height="h-28" />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && (
        <div className="grid gap-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
            {q.data.map((o) => (
              <Link key={o.key} to={HREF[o.key] ?? "/"} className="group grid gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent">
                <div className="flex items-center justify-between text-xs tracking-wide text-muted-foreground uppercase">
                  {o.label}
                  <ArrowUpRightIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="font-heading text-3xl font-semibold">{o.key === "settings" ? (o.count ? "Set" : "Default") : o.count}</div>
                <div className="text-xs text-muted-foreground">
                  {o.key === "messages" && (o.unread ?? 0) > 0 ? <span className="font-medium text-primary">{o.unread} unread</span> : o.updatedAt ? `Updated ${timeAgo(o.updatedAt)}` : "Nothing yet"}
                </div>
              </Link>
            ))}
          </div>
          <RecentMessages />
        </div>
      )}
    </>
  )
}
