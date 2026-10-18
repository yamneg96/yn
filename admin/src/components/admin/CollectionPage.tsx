import { useState, type ReactNode } from "react"
import { ArrowDownIcon, ArrowUpIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { ChipsField, ColorField, ImageField, SelectField, SwitchField, TextAreaField, TextField, type Errors } from "./fields"
import { ConfirmDialog } from "./ConfirmDialog"
import { EmptyState, ErrorState, ListSkeleton, PageHeader } from "./states"
import { useCollection, useCollectionMutations } from "@/hooks/use-admin"
import { ApiError } from "@/lib/api"

type Item = { id: string; order: number; published?: boolean } & Record<string, unknown>
type Draft = Record<string, unknown>

export interface FieldDef {
  key: string
  label: string
  type: "text" | "textarea" | "chips" | "color" | "select" | "image" | "switch"
  options?: { value: string; label: string }[]
  hint?: string
  placeholder?: string
  /** Show beside the previous field on wide screens. */
  half?: boolean
  rows?: number
  mono?: boolean
}

export interface CollectionConfig {
  path: string
  noun: string
  title: string
  description: string
  empty: { title: string; message: string }
  fields: FieldDef[]
  defaults: Draft
  hasPublished?: boolean
  /** How a row looks in the list. */
  row: (item: Item) => { title: string; subtitle?: string; color?: string; leading?: ReactNode; chips?: string[] }
}

function FieldInput({ def, draft, set, errors }: { def: FieldDef; draft: Draft; set: (key: string, v: unknown) => void; errors: Errors }) {
  const v = draft[def.key]
  const error = errors[def.key]
  const common = { label: def.label, hint: def.hint, error }
  switch (def.type) {
    case "text":
      return <TextField {...common} value={(v as string) ?? ""} placeholder={def.placeholder} mono={def.mono} onChange={(x) => set(def.key, x)} />
    case "textarea":
      return <TextAreaField {...common} rows={def.rows} value={(v as string) ?? ""} placeholder={def.placeholder} onChange={(x) => set(def.key, x)} />
    case "chips":
      return <ChipsField {...common} value={(v as string[]) ?? []} placeholder={def.placeholder} onChange={(x) => set(def.key, x)} />
    case "color":
      return <ColorField {...common} value={(v as string) ?? "#22d3ee"} onChange={(x) => set(def.key, x)} />
    case "select":
      return <SelectField {...common} value={(v as string) ?? ""} options={def.options ?? []} onChange={(x) => set(def.key, x)} />
    case "image":
      return <ImageField {...common} value={(v as string) ?? ""} onChange={(x) => set(def.key, x)} />
    case "switch":
      return <SwitchField label={def.label} hint={def.hint} checked={Boolean(v)} onChange={(x) => set(def.key, x)} />
  }
}

function EditDialog({ config, item, count, onClose }: { config: CollectionConfig; item: Item | "new"; count: number; onClose: () => void }) {
  const { save } = useCollectionMutations<Item>(config.path, config.noun)
  const editing = item === "new" ? null : item
  const [draft, setDraft] = useState<Draft>(() => ({ ...config.defaults, ...(editing ?? {}) }))
  const [errors, setErrors] = useState<Errors>({})
  const set = (key: string, v: unknown) => {
    setDraft((d) => ({ ...d, [key]: v }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const body: Draft = { order: editing ? editing.order : count }
    for (const f of config.fields) body[f.key] = draft[f.key]
    if (config.hasPublished) body.published = draft.published ?? true
    save.mutate(
      { id: editing?.id, body },
      {
        onSuccess: onClose,
        onError: (err) => {
          if (err instanceof ApiError && err.status === 400) setErrors(err.fieldErrors)
        },
      }
    )
  }

  // Lay out consecutive `half` fields side by side.
  const rows: FieldDef[][] = []
  for (const f of config.fields) {
    const last = rows[rows.length - 1]
    if (f.half && last && last.length === 1 && last[0].half) last.push(f)
    else rows.push([f])
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${config.noun.toLowerCase()}` : `New ${config.noun.toLowerCase()}`}</DialogTitle>
            <DialogDescription>Saved changes appear on the portfolio right away.</DialogDescription>
          </DialogHeader>
          {rows.map((row, i) => (
            <div key={i} className={row.length > 1 ? "grid gap-4 sm:grid-cols-2" : "grid"}>
              {row.map((def) => (
                <FieldInput key={def.key} def={def} draft={draft} set={set} errors={errors} />
              ))}
            </div>
          ))}
          {config.hasPublished && <SwitchField label="Published" hint="Unpublished items stay in the CMS but are hidden from the site." checked={draft.published !== false} onChange={(v) => set("published", v)} />}
          {errors._ && <p className="text-sm text-destructive">{errors._}</p>}
          {save.isError && !(save.error instanceof ApiError && save.error.status === 400) && (
            <p role="alert" className="text-sm text-destructive">
              {save.error.message}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CollectionPage({ config }: { config: CollectionConfig }) {
  const q = useCollection<Item>(config.path)
  const { save, remove, reorder } = useCollectionMutations<Item>(config.path, config.noun)
  const [editing, setEditing] = useState<Item | "new" | null>(null)
  const [deleting, setDeleting] = useState<Item | null>(null)
  const items = q.data ?? []

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    reorder.mutate(next.map((x) => x.id))
  }

  const togglePublished = (item: Item) => {
    const body: Draft = { order: item.order, published: !item.published }
    for (const f of config.fields) body[f.key] = item[f.key]
    save.mutate({ id: item.id, body })
  }

  return (
    <>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <Button onClick={() => setEditing("new")}>
            <PlusIcon /> Add {config.noun.toLowerCase()}
          </Button>
        }
      />

      {q.isPending && <ListSkeleton />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && items.length === 0 && (
        <EmptyState
          {...config.empty}
          action={
            <Button onClick={() => setEditing("new")}>
              <PlusIcon /> Add {config.noun.toLowerCase()}
            </Button>
          }
        />
      )}
      {q.isSuccess && items.length > 0 && (
        <ul className="grid gap-2.5">
          {items.map((item, i) => {
            const r = config.row(item)
            return (
              <li key={item.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4">
                <div className="flex shrink-0 flex-col">
                  <Button variant="ghost" size="icon-xs" aria-label="Move up" disabled={i === 0 || reorder.isPending} onClick={() => move(i, -1)}>
                    <ArrowUpIcon />
                  </Button>
                  <Button variant="ghost" size="icon-xs" aria-label="Move down" disabled={i === items.length - 1 || reorder.isPending} onClick={() => move(i, 1)}>
                    <ArrowDownIcon />
                  </Button>
                </div>
                {r.color && <span className="size-9 shrink-0 rounded-lg border" style={{ background: r.color }} aria-hidden="true" />}
                {r.leading}
                <button className="min-w-0 flex-1 text-left" onClick={() => setEditing(item)}>
                  <div className="truncate font-medium">{r.title}</div>
                  {r.subtitle && <div className="line-clamp-2 text-sm text-muted-foreground">{r.subtitle}</div>}
                  {r.chips && r.chips.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {r.chips.slice(0, 6).map((c) => (
                        <span key={c} className="rounded bg-secondary px-1.5 py-0.5 text-[0.7rem]">
                          {c}
                        </span>
                      ))}
                      {r.chips.length > 6 && <span className="text-[0.7rem] text-muted-foreground">+{r.chips.length - 6}</span>}
                    </div>
                  )}
                </button>
                {config.hasPublished && (
                  <label className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                    {item.published === false ? "Draft" : "Live"}
                    <Switch size="sm" checked={item.published !== false} onCheckedChange={() => togglePublished(item)} aria-label="Published" />
                  </label>
                )}
                <Button variant="ghost" size="icon" aria-label={`Edit ${r.title}`} onClick={() => setEditing(item)}>
                  <PencilIcon />
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Delete ${r.title}`} onClick={() => setDeleting(item)}>
                  <Trash2Icon />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      {editing && <EditDialog key={editing === "new" ? "new" : editing.id} config={config} item={editing} count={items.length} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete this ${config.noun.toLowerCase()}?`}
        description={deleting ? `“${config.row(deleting).title}” will be removed from the portfolio permanently.` : ""}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id)
          setDeleting(null)
        }}
      />
    </>
  )
}
