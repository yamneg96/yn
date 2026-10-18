import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChipsField, ColorField, FormSection, ImageField, MetricsField, SelectField, SwitchField, TextAreaField, TextField, type Errors } from "@/components/admin/fields"
import { ErrorState, ListSkeleton, PageHeader } from "@/components/admin/states"
import { useCollection, useCollectionMutations } from "@/hooks/use-admin"
import { ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"
import { PROJECT_CATEGORY_OPTIONS, type Project, type ProjectCategory } from "@/lib/types"

type Draft = Omit<Project, "id" | "createdAt" | "updatedAt" | "order"> & { order?: number }

const BLANK: Draft = {
  slug: "",
  title: "",
  name: "",
  summary: "",
  kind: "Web",
  role: "",
  categories: [],
  accent: "#22d3ee",
  accent2: "#6366f1",
  art: "graph",
  coverImageUrl: "",
  featured: false,
  overview: "",
  challenge: "",
  solution: "",
  outcome: "",
  features: [],
  stack: [],
  metrics: [],
  arch: { clients: [], api: "", back: [] },
  liveUrl: "",
  sourceUrl: "",
  adminUrl: "",
  mobileUrl: "",
  embedMode: "live",
  embedNote: "",
  published: true,
}

const ART = [
  { value: "pulse", label: "Pulse" },
  { value: "hex", label: "Hexagons" },
  { value: "graph", label: "Graph" },
  { value: "stars", label: "Stars" },
  { value: "tags", label: "Tags" },
  { value: "bars", label: "Bars" },
] as const

function toDraft(p: Project): Draft {
  const { id, createdAt, updatedAt, ...rest } = p
  void id
  void createdAt
  void updatedAt
  return { ...BLANK, ...rest, slug: rest.slug ?? "", coverImageUrl: rest.coverImageUrl ?? "", outcome: rest.outcome ?? "", liveUrl: rest.liveUrl ?? "", sourceUrl: rest.sourceUrl ?? "", adminUrl: rest.adminUrl ?? "", mobileUrl: rest.mobileUrl ?? "", embedNote: rest.embedNote ?? "" }
}

function Editor({ initial, id, count }: { initial: Draft; id?: string; count: number }) {
  const navigate = useNavigate()
  const { save } = useCollectionMutations<Project>("projects", "Project")
  const [draft, setDraft] = useState<Draft>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [dirty, setDirty] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setDirty(true)
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: "" }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // A blank slug is omitted so the API derives it from the title.
    const body = { ...draft, slug: draft.slug?.trim() || undefined, order: draft.order ?? count }
    save.mutate(
      { id, body },
      {
        onSuccess: (saved) => {
          setDirty(false)
          if (!id) navigate(`/projects/${saved.id}`, { replace: true })
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 400) {
            setErrors(err.fieldErrors)
            document.querySelector<HTMLElement>("[aria-invalid='true']")?.scrollIntoView({ block: "center", behavior: "smooth" })
          }
        },
      }
    )
  }

  const toggleCategory = (c: ProjectCategory) => set("categories", draft.categories.includes(c) ? draft.categories.filter((x) => x !== c) : [...draft.categories, c])
  const hasLive = Boolean(draft.liveUrl)
  const archErr = (k: string) => errors[`arch.${k}`]

  return (
    <form onSubmit={submit} className="grid gap-5 pb-24">
      <FormSection title="Basics" description="Shown on the project card and the top of the case file.">
        <TextField label="Full title" value={draft.title} error={errors.title} onChange={(v) => set("title", v)} placeholder="DonorLink — National Blood Logistics Platform" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Short name" value={draft.name} error={errors.name} onChange={(v) => set("name", v)} placeholder="DonorLink" />
          <TextField label="URL slug" value={draft.slug ?? ""} error={errors.slug} onChange={(v) => set("slug", v)} mono placeholder="auto from the title" hint="Used in the #case-… deep link." />
        </div>
        <TextAreaField label="Card summary" rows={2} value={draft.summary} error={errors.summary} onChange={(v) => set("summary", v)} hint="One or two sentences under the project name." />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Platform" value={draft.kind} onChange={(v) => set("kind", v)} placeholder="Web + Mobile" />
          <TextField label="Your role" value={draft.role} onChange={(v) => set("role", v)} placeholder="Lead full-stack developer" />
        </div>
        <div className="grid gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Categories</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Categories">
            {PROJECT_CATEGORY_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={draft.categories.includes(c.value)}
                onClick={() => toggleCategory(c.value)}
                className={cn("rounded-full border px-3 py-1 text-sm transition-colors", draft.categories.includes(c.value) ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent")}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SwitchField label="Featured" hint="Appears in the hero channel feed." checked={draft.featured} onChange={(v) => set("featured", v)} />
          <SwitchField label="Published" hint="Hidden from the site when off." checked={draft.published} onChange={(v) => set("published", v)} />
        </div>
      </FormSection>

      <FormSection title="Look" description="Colours drive the hero theme while this project is the active channel.">
        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField label="Accent" value={draft.accent} error={errors.accent} onChange={(v) => set("accent", v)} />
          <ColorField label="Secondary" value={draft.accent2} error={errors.accent2} onChange={(v) => set("accent2", v)} />
          <SelectField label="Cover artwork" value={draft.art} options={[...ART]} onChange={(v) => set("art", v)} />
        </div>
        <div className="h-3 rounded-full" style={{ background: `linear-gradient(90deg, ${draft.accent}, ${draft.accent2})` }} aria-hidden="true" />
        <ImageField label="Cover image (optional)" value={draft.coverImageUrl ?? ""} error={errors.coverImageUrl} onChange={(v) => set("coverImageUrl", v)} hint="Replaces the generated artwork on the card and in the case file." />
      </FormSection>

      <FormSection title="Case study" description="The write-up inside the case-file modal.">
        <TextAreaField label="Overview" rows={3} value={draft.overview} onChange={(v) => set("overview", v)} />
        <div className="grid gap-4 md:grid-cols-3">
          <TextAreaField label="Challenge" rows={5} value={draft.challenge} onChange={(v) => set("challenge", v)} />
          <TextAreaField label="Solution" rows={5} value={draft.solution} onChange={(v) => set("solution", v)} />
          <TextAreaField label="Outcome" rows={5} value={draft.outcome ?? ""} onChange={(v) => set("outcome", v)} hint="Leave empty for an automatic line." />
        </div>
        <ChipsField label="Key features" value={draft.features} onChange={(v) => set("features", v)} placeholder="Type a feature and press Enter" hint="Commas are treated as separators, so keep each feature free of them." />
        <ChipsField label="Tech stack" value={draft.stack} onChange={(v) => set("stack", v)} placeholder="React, Node.js…" />
      </FormSection>

      <FormSection title="Impact metrics" description="Numbers that count up in the case file.">
        <MetricsField label="Metrics" value={draft.metrics} errors={errors} onChange={(v) => set("metrics", v)} hint="e.g. 6 · apps · or 99 · % · uptime" />
      </FormSection>

      <FormSection title="Architecture" description="Drawn as clients → API → back end in the case file.">
        <div className="grid gap-4 md:grid-cols-3">
          <ChipsField label="Clients" value={draft.arch.clients} error={archErr("clients")} onChange={(v) => set("arch", { ...draft.arch, clients: v })} placeholder="Web, Mobile…" />
          <TextField label="API / core" value={draft.arch.api} error={archErr("api")} onChange={(v) => set("arch", { ...draft.arch, api: v })} placeholder="Express API" />
          <ChipsField label="Back end" value={draft.arch.back} error={archErr("back")} onChange={(v) => set("arch", { ...draft.arch, back: v })} placeholder="MongoDB, Redis…" />
        </div>
      </FormSection>

      <FormSection title="Links and live preview" description="With a live URL the case file shows the deployed site in a mini browser.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Live site" mono value={draft.liveUrl ?? ""} error={errors.liveUrl} onChange={(v) => set("liveUrl", v)} placeholder="https://…" />
          <TextField label="Source code" mono value={draft.sourceUrl ?? ""} error={errors.sourceUrl} onChange={(v) => set("sourceUrl", v)} placeholder="https://github.com/…" />
          <TextField label="Admin panel" mono value={draft.adminUrl ?? ""} error={errors.adminUrl} onChange={(v) => set("adminUrl", v)} placeholder="https://…" />
          <TextField label="Mobile app" mono value={draft.mobileUrl ?? ""} error={errors.mobileUrl} onChange={(v) => set("mobileUrl", v)} placeholder="https://…" />
        </div>
        {hasLive && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Live preview mode"
              value={draft.embedMode}
              onChange={(v) => set("embedMode", v)}
              options={[
                { value: "live", label: "Show the live site" },
                { value: "blocked", label: "Site blocks embedding" },
                { value: "down", label: "Site is down right now" },
              ]}
              hint="Pick a fallback when the site can’t be framed."
            />
            <TextField label="Fallback note" mono value={draft.embedNote ?? ""} onChange={(v) => set("embedNote", v)} placeholder="X-Frame-Options: DENY" hint="Shown in the fallback message (a header name or HTTP status)." />
          </div>
        )}
      </FormSection>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 lg:px-6">
          <span className="text-sm text-muted-foreground">{save.isPending ? "Saving…" : dirty ? "Unsaved changes" : id ? "All changes saved" : "New project"}</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" nativeButton={false} render={<Link to="/projects" />}>
              Back
            </Button>
            <Button type="submit" disabled={save.isPending}>
              <SaveIcon /> {id ? "Save changes" : "Create project"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export function ProjectEditor() {
  const { id } = useParams()
  const q = useCollection<Project>("projects")
  const project = id ? q.data?.find((p) => p.id === id) : undefined

  return (
    <>
      <Link to="/projects" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" /> All projects
      </Link>
      <PageHeader title={id ? (project?.name ?? "Edit project") : "New project"} description={id ? "Edit the card, case study, metrics and links." : "Fill in the basics now. You can add the rest later."} />
      {q.isPending && <ListSkeleton rows={4} height="h-40" />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && id && !project && <ErrorState title="Project not found" error={new Error("It may have been deleted.")} />}
      {q.isSuccess && (!id || project) && <Editor key={id ?? "new"} id={id} initial={project ? toDraft(project) : BLANK} count={q.data.length} />}
    </>
  )
}
