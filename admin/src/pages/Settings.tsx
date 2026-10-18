import { useState } from "react"
import { SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChipsField, FormSection, ImageField, MetricsField, SwitchField, TextAreaField, TextField, type Errors } from "@/components/admin/fields"
import { ErrorState, ListSkeleton, PageHeader } from "@/components/admin/states"
import { useSaveSettings, useSettings } from "@/hooks/use-admin"
import { ApiError } from "@/lib/api"
import type { SiteSettings } from "@/lib/types"

type Draft = Omit<SiteSettings, "id" | "createdAt" | "updatedAt">

function toDraft(s: SiteSettings): Draft {
  const { id, createdAt, updatedAt, ...rest } = s
  void id
  void createdAt
  void updatedAt
  return { ...rest, heroImageUrl: rest.heroImageUrl ?? "", resumeUrl: rest.resumeUrl ?? "", email: rest.email ?? "", phone: rest.phone ?? "" }
}

function Form({ initial }: { initial: Draft }) {
  const save = useSaveSettings()
  const [draft, setDraft] = useState<Draft>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [dirty, setDirty] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setDirty(true)
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: "" }))
  }
  const text = (key: keyof Draft, label: string, extra: { hint?: string; placeholder?: string; mono?: boolean } = {}) => (
    <TextField label={label} value={(draft[key] as string) ?? ""} error={errors[key as string]} onChange={(v) => set(key, v as never)} {...extra} />
  )
  const area = (key: keyof Draft, label: string, rows = 3, hint?: string) => (
    <TextAreaField label={label} rows={rows} hint={hint} value={(draft[key] as string) ?? ""} error={errors[key as string]} onChange={(v) => set(key, v as never)} />
  )

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(draft, {
      onSuccess: () => setDirty(false),
      onError: (err) => {
        if (err instanceof ApiError && err.status === 400) {
          setErrors(err.fieldErrors)
          document.querySelector<HTMLElement>("[aria-invalid='true']")?.scrollIntoView({ block: "center", behavior: "smooth" })
        }
      },
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-5 pb-24">
      <FormSection title="Identity" description="Used in the navigation, hero and footer.">
        <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
          {text("fullName", "Full name")}
          {text("initials", "Initials")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {text("location", "Location", { placeholder: "Addis Ababa, Ethiopia" })}
          {text("coordinates", "Coordinates", { placeholder: "9.03°N 38.74°E", mono: true })}
          {text("timezone", "Time zone (IANA)", { placeholder: "Africa/Addis_Ababa", mono: true, hint: "Drives the live clocks." })}
          {text("timezoneLabel", "Time zone label", { placeholder: "EAT" })}
          {text("email", "Email", { placeholder: "you@example.com" })}
          {text("phone", "Phone")}
        </div>
        <ImageField label="Hero portrait (optional)" value={draft.heroImageUrl ?? ""} error={errors.heroImageUrl} onChange={(v) => set("heroImageUrl", v)} />
        <ImageField file label="Résumé (PDF)" value={draft.resumeUrl ?? ""} error={errors.resumeUrl} onChange={(v) => set("resumeUrl", v)} hint="Upload a PDF or paste a link. The Résumé button on the site opens it." />
      </FormSection>

      <FormSection title="Hero" description="The first screen visitors see.">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <SwitchField label="Available for work" hint="Controls the status pill." checked={draft.available} onChange={(v) => set("available", v)} />
          {text("availability", "Availability text", { placeholder: "Available for new projects" })}
        </div>
        {text("heroTitle", "Headline", { placeholder: "I build full-stack systems that ship." })}
        {text("heroHighlight", "Highlighted words", { hint: "Must appear in the headline. They get the gradient." })}
        <ChipsField label="Rotating roles" value={draft.heroRoles} onChange={(v) => set("heroRoles", v)} hint="Typed out one by one under the headline." />
        {area("heroSubtitle", "Subtitle", 3)}
        <MetricsField label="Headline stats" prefix="stats" max={6} value={draft.stats} errors={errors} onChange={(v) => set("stats", v)} hint="Up to six counters, e.g. 20 · + · Systems shipped." />
      </FormSection>

      <FormSection title="About" description="The bento grid under the hero.">
        <div className="grid gap-4 sm:grid-cols-2">
          {text("aboutHeading", "Section heading")}
          {area("aboutIntro", "Intro", 2)}
        </div>
        {area("principle", "Operating principle", 3)}
        <ChipsField label="Principle tags" value={draft.principleTags} onChange={(v) => set("principleTags", v)} />
        <ChipsField label="Daily stack" value={draft.dailyStack} onChange={(v) => set("dailyStack", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          {area("timezoneNote", "Time zone note", 3)}
          {area("learningNote", "Always learning", 3)}
        </div>
        {area("insideScoop", "The inside scoop", 3)}
        <div className="grid gap-4 sm:grid-cols-2">
          {text("scoopRole", "Current role")}
          {text("scoopSince", "Since")}
        </div>
        {text("ctaHeading", "Start-a-project heading")}
      </FormSection>

      <FormSection title="Contact section" description="The footer call to action above the contact form.">
        {text("contactHeading", "Heading", { placeholder: "Ready to build something that ships?" })}
        {text("contactHighlight", "Highlighted words", { hint: "Must appear in the heading." })}
        {area("contactIntro", "Intro text", 3)}
      </FormSection>

      <FormSection title="Education and languages">
        <div className="grid gap-4 sm:grid-cols-2">
          {text("educationSchool", "School")}
          {text("educationDegree", "Degree")}
        </div>
        {text("languages", "Languages", { placeholder: "English (professional) · Amharic (native)" })}
      </FormSection>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 lg:px-6">
          <span className="text-sm text-muted-foreground">{save.isPending ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}</span>
          <Button type="submit" disabled={save.isPending || !dirty}>
            <SaveIcon /> Save settings
          </Button>
        </div>
      </div>
    </form>
  )
}

export function Settings() {
  const q = useSettings()
  return (
    <>
      <PageHeader title="Site settings" description="Copy and details for the hero, about, contact and footer sections." />
      {q.isPending && <ListSkeleton rows={3} height="h-48" />}
      {q.isError && <ErrorState error={q.error} onRetry={() => q.refetch()} />}
      {q.isSuccess && <Form initial={toDraft(q.data)} />}
    </>
  )
}
