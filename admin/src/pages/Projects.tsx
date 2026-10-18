import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon, PencilIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState, ErrorState, ListSkeleton, PageHeader } from "@/components/admin/states"
import { useCollection, useCollectionMutations } from "@/hooks/use-admin"
import { hostOf } from "@/lib/format"
import type { Project } from "@/lib/types"

/** Colour swatch used when a project has no uploaded cover. */
function Thumb({ p }: { p: Project }) {
  return p.coverImageUrl ? (
    <img src={p.coverImageUrl} alt="" className="size-14 shrink-0 rounded-lg border object-cover sm:size-16" />
  ) : (
    <span className="size-14 shrink-0 rounded-lg border sm:size-16" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent2})` }} aria-hidden="true" />
  )
}

export function Projects() {
  const q = useCollection<Project>("projects")
  const { save, remove, reorder } = useCollectionMutations<Project>("projects", "Project")
  const [deleting, setDeleting] = useState<Project | null>(null)
  const items = q.data ?? []

  const move = (i: number, dir: -1 | 1) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    reorder.mutate(next.map((p) => p.id))
  }

  const toggle = (p: Project, patch: Partial<Project>) => {
    const { id, createdAt, updatedAt, ...body } = { ...p, ...patch }
    void createdAt
    void updatedAt
    save.mutate({ id, body })
  }

  const add = (
    <Button nativeButton={false} render={<Link to="/projects/new" />}>
      <PlusIcon /> New project
    </Button>
  )

  return (
    <>
      <PageHeader title="Projects" description="Each project is a case file on the portfolio: live site, architecture, metrics and links." actions={add} />

      {q.isPending && <ListSkeleton rows={5} height="h-24" />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && items.length === 0 && <EmptyState title="No projects yet" message="Add your first project. You will be able to fill in the full case study." action={add} />}
      {q.isSuccess && items.length > 0 && (
        <ul className="grid gap-2.5">
          {items.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4">
              <div className="flex shrink-0 flex-col">
                <Button variant="ghost" size="icon-xs" aria-label="Move up" disabled={i === 0 || reorder.isPending} onClick={() => move(i, -1)}>
                  <ArrowUpIcon />
                </Button>
                <Button variant="ghost" size="icon-xs" aria-label="Move down" disabled={i === items.length - 1 || reorder.isPending} onClick={() => move(i, 1)}>
                  <ArrowDownIcon />
                </Button>
              </div>
              <Thumb p={p} />
              <Link to={`/projects/${p.id}`} className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="truncate font-medium">{p.name}</span>
                  {p.featured && <StarIcon className="size-3.5 fill-warning text-warning" aria-label="Featured" />}
                  {!p.published && <span className="rounded bg-muted px-1.5 py-0.5 text-[0.7rem] text-muted-foreground">Draft</span>}
                </div>
                <p className="line-clamp-1 text-sm text-muted-foreground">{p.summary}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{p.kind}</span>
                  <span className={p.liveUrl ? "text-success" : ""}>{p.liveUrl ? `Live · ${hostOf(p.liveUrl)}` : "Source only"}</span>
                  {p.liveUrl && p.embedMode !== "live" && <span className="text-warning">{p.embedMode === "down" ? "Site down" : "Embed blocked"}</span>}
                </div>
              </Link>
              <label className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                {p.published ? "Live" : "Draft"}
                <Switch size="sm" checked={p.published} onCheckedChange={(v) => toggle(p, { published: v })} aria-label="Published" />
              </label>
              {p.liveUrl && (
                <Button variant="ghost" size="icon" aria-label={`Open ${p.name} in a new tab`} nativeButton={false} render={<a href={p.liveUrl} target="_blank" rel="noopener noreferrer" />}>
                  <ExternalLinkIcon />
                </Button>
              )}
              <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} nativeButton={false} render={<Link to={`/projects/${p.id}`} />}>
                <PencilIcon />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`} onClick={() => setDeleting(p)}>
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this project?"
        description={deleting ? `“${deleting.name}” and its case study will be removed permanently.` : ""}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id)
          setDeleting(null)
        }}
      />
    </>
  )
}
