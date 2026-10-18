import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { FileTextIcon, ImageUpIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useUpload } from "@/hooks/use-admin"
import { cn } from "@/lib/utils"
import type { Metric } from "@/lib/types"

export type Errors = Record<string, string>

export function Field({ label, hint, error, htmlFor, children, className }: { label: string; hint?: string; error?: string; htmlFor?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid min-w-0 gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

interface BaseProps {
  label: string
  hint?: string
  error?: string
  className?: string
}

export function TextField({ label, hint, error, className, value, onChange, placeholder, type = "text", mono, maxLength, autoComplete }: BaseProps & { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean; maxLength?: number; autoComplete?: string }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <Input id={id} type={type} value={value} maxLength={maxLength} autoComplete={autoComplete} placeholder={placeholder} aria-invalid={Boolean(error)} className={cn(mono && "font-mono text-[0.82rem]")} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export function TextAreaField({ label, hint, error, className, value, onChange, rows = 4, placeholder }: BaseProps & { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <Textarea id={id} rows={rows} value={value} placeholder={placeholder} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

export function SwitchField({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-card px-3 py-2.5">
      <label htmlFor={id} className="grid min-w-0 cursor-pointer gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function SelectField<T extends string>({ label, hint, error, className, value, onChange, options }: BaseProps & { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 [&>option]:bg-popover [&>option]:text-popover-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function ColorField({ label, error, hint, className, value, onChange }: BaseProps & { value: string; onChange: (v: string) => void }) {
  const id = useId()
  const valid = /^#[0-9a-fA-F]{6}$/.test(value)
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={valid ? value : "#22d3ee"}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error) || !valid} className="font-mono text-[0.82rem]" maxLength={7} />
      </div>
    </Field>
  )
}

/** Type a value and press Enter or comma; Backspace on an empty box removes the last chip. */
export function ChipsField({ label, hint, error, className, value, onChange, placeholder = "Type and press Enter" }: BaseProps & { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("")
  const id = useId()
  const add = (raw: string) => {
    const next = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !value.includes(s))
    if (next.length) onChange([...value, ...next])
    setDraft("")
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      add(draft)
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <div className="flex min-h-8 flex-wrap items-center gap-1.5 rounded-lg border border-input p-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30">
        {value.map((c) => (
          <span key={c} className="inline-flex items-center gap-1 rounded-md bg-secondary py-0.5 pr-1 pl-2 text-xs">
            {c}
            <button type="button" aria-label={`Remove ${c}`} className="rounded p-0.5 hover:bg-foreground/10" onClick={() => onChange(value.filter((x) => x !== c))}>
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft.trim() && add(draft)}
          className="min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </Field>
  )
}

/** Upload-or-paste-a-URL field. `file` switches it to documents (PDF) instead of images. */
export function ImageField({ label, hint, error, className, value, onChange, file = false }: BaseProps & { value: string; onChange: (v: string) => void; file?: boolean }) {
  const upload = useUpload()
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <div className="flex items-start gap-3">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted text-muted-foreground">
          {file ? <FileTextIcon className="size-6" /> : value ? <img src={value} alt="" className="size-full object-cover" /> : <ImageUpIcon className="size-5" />}
        </div>
        <div className="grid min-w-0 flex-1 gap-2">
          <Input id={id} value={value} placeholder="https://… or /uploads/…" onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className="font-mono text-[0.82rem]" />
          <div className="flex flex-wrap gap-2">
            <input
              ref={input}
              type="file"
              accept={file ? "application/pdf" : "image/*"}
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (file) upload.mutate(file, { onSuccess: onChange })
              }}
            />
            <Button type="button" variant="outline" size="sm" disabled={upload.isPending} onClick={() => input.current?.click()}>
              <ImageUpIcon /> {upload.isPending ? "Uploading…" : file ? "Upload PDF" : "Upload image"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <Trash2Icon /> Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </Field>
  )
}

export function MetricsField({ label, hint, errors = {}, prefix = "metrics", value, onChange, max = 6 }: { label: string; hint?: string; errors?: Errors; prefix?: string; value: Metric[]; onChange: (v: Metric[]) => void; max?: number }) {
  const patch = (i: number, p: Partial<Metric>) => onChange(value.map((m, k) => (k === i ? { ...m, ...p } : m)))
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        <Button type="button" variant="outline" size="xs" disabled={value.length >= max} onClick={() => onChange([...value, { value: 0, suffix: "", label: "" }])}>
          <PlusIcon /> Add
        </Button>
      </div>
      {value.length === 0 && <p className="rounded-lg border border-dashed px-3 py-3 text-center text-xs text-muted-foreground">{hint ?? "None yet."}</p>}
      {value.map((m, i) => (
        <div key={i} className="grid grid-cols-[5rem_4rem_minmax(0,1fr)_auto] items-start gap-2">
          <Input type="number" aria-label="Value" value={Number.isFinite(m.value) ? m.value : 0} onChange={(e) => patch(i, { value: Number(e.target.value) })} />
          <Input aria-label="Suffix" value={m.suffix} placeholder="+, %, k" onChange={(e) => patch(i, { suffix: e.target.value })} />
          <div className="grid gap-1">
            <Input aria-label="Label" value={m.label} placeholder="Label" aria-invalid={Boolean(errors[`${prefix}.${i}.label`])} onChange={(e) => patch(i, { label: e.target.value })} />
            {errors[`${prefix}.${i}.label`] && <p className="text-xs text-destructive">{errors[`${prefix}.${i}.label`]}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Remove" onClick={() => onChange(value.filter((_, k) => k !== i))}>
            <Trash2Icon />
          </Button>
        </div>
      ))}
    </div>
  )
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 rounded-xl border bg-card p-4 sm:p-5">
      <header>
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  )
}
