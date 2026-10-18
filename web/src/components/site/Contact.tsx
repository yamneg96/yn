import { useState, type FormEvent } from "react"
import { Icon } from "./Icon"
import { useSettings, useSendMessage, useSocialLinks } from "@/hooks/use-content"
import { useClock } from "@/hooks/use-ui"
import { ApiError } from "@/lib/api"
import { copyEmail } from "@/lib/clipboard"
import { hostOf, splitHighlight } from "@/lib/format"
import type { MessageTopic } from "@/lib/types"
import { toast } from "@/stores/toast"

const TOPICS: { key: MessageTopic; label: string }[] = [
  { key: "project", label: "A project" },
  { key: "job", label: "A role" },
  { key: "collab", label: "Collaboration" },
  { key: "other", label: "Something else" },
]

type Errors = Partial<Record<"name" | "email" | "message", string>>

function validate(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = "Tell me your name (2+ characters)."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email so I can reply."
  if (v.message.trim().length < 10) e.message = "A few more words, please (10+ characters)."
  else if (v.message.length > 4000) e.message = "That is a bit long. Keep it under 4000 characters."
  return e
}

function ContactForm() {
  const send = useSendMessage()
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" })
  const [topic, setTopic] = useState<MessageTopic>("project")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }))
    if (k !== "website" && errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.querySelector<HTMLElement>(".cform [aria-invalid='true']")?.focus()
      return
    }
    send.mutate(
      { name: values.name.trim(), email: values.email.trim(), topic, message: values.message.trim(), website: values.website },
      {
        onSuccess: () => {
          setSent(true)
          toast.ok("Message sent. I’ll reply soon.")
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 400) {
            const f = err.fieldErrors
            setErrors({ name: f.name, email: f.email, message: f.message })
          } else if (err instanceof ApiError && err.status === 429) {
            toast.error("Too many messages from this device. Please try again later.")
          } else {
            toast.error(err instanceof Error ? err.message : "Couldn’t send the message.")
          }
        },
      },
    )
  }

  if (sent) {
    return (
      <div className="cform sent" role="status">
        <span className="ico">
          <Icon name="check" />
        </span>
        <h3>Message received.</h3>
        <p>Thanks, {values.name.split(" ")[0] || "friend"}. It’s in my inbox now and I’ll answer at {values.email}.</p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setSent(false)
            setValues({ name: "", email: "", message: "", website: "" })
            send.reset()
          }}
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form className="cform" onSubmit={submit} noValidate aria-label="Contact form">
      <div className="topics" role="group" aria-label="What is this about?">
        {TOPICS.map((t) => (
          <button key={t.key} type="button" className="filter" aria-pressed={topic === t.key} onClick={() => setTopic(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="row2">
        <label className="fld">
          <span>Name</span>
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "e-name" : undefined}
          />
          {errors.name && (
            <small className="err" id="e-name">
              {errors.name}
            </small>
          )}
        </label>
        <label className="fld">
          <span>Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "e-email" : undefined}
          />
          {errors.email && (
            <small className="err" id="e-email">
              {errors.email}
            </small>
          )}
        </label>
      </div>

      <label className="fld">
        <span>Message</span>
        <textarea
          rows={5}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="What are you building, who is it for, and when does it need to be live?"
          maxLength={4000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "e-message" : undefined}
        />
        {errors.message && (
          <small className="err" id="e-message">
            {errors.message}
          </small>
        )}
      </label>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className="acts">
        <button className="btn btn-primary" type="submit" disabled={send.isPending}>
          {send.isPending ? "Sending…" : "Send message"} <Icon name="arrow" className="nudge" />
        </button>
      </div>
    </form>
  )
}

export function Contact() {
  const settings = useSettings().data
  const socials = useSocialLinks().data ?? []
  const clock = useClock(settings?.timezone ?? "Africa/Addis_Ababa")
  const email = settings?.email ?? ""
  const [lead, hl, tail] = splitHighlight(settings?.contactHeading ?? "Ready to build something that ships?", settings?.contactHighlight ?? "ships?")

  return (
    <footer className="contact" id="contact">
      <div className="horizon" aria-hidden="true" />
      <div className="wrap">
        <div className="eyebrow">
          Contact <b>/ let’s talk</b>
        </div>
        <h2 className="big-cta" style={{ marginTop: 20 }}>
          {lead}
          <span className="grad">{hl}</span>
          {tail}
        </h2>

        <div className="contact-row">
          <div>
            <p>{settings?.contactIntro ?? "Tell me what you’re building, who it’s for and when it needs to be live."}</p>
            <ContactForm />
            {email && (
              <div className="acts">
                <a className="btn btn-ghost" href={`mailto:${email}`}>
                  Or email me directly <Icon name="arrow" className="nudge" />
                </a>
                <button className="btn btn-ghost" type="button" onClick={(e) => copyEmail(email, e.currentTarget)}>
                  <Icon name="copy" />
                  Copy email
                </button>
              </div>
            )}
            {(email || settings?.phone) && (
              <p className="mono" style={{ marginTop: 16, fontSize: ".78rem", color: "var(--fg-3)" }}>
                {[email, settings?.phone].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <nav className="socials" aria-label="Profiles">
            {socials.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">
                <div>
                  <strong>{s.platform}</strong>
                  <span>{s.note || `${hostOf(s.url)}`}</span>
                </div>
                <Icon name="up-right" />
              </a>
            ))}
          </nav>
        </div>

        <div className="foot">
          <span>
            © {new Date().getFullYear()} {settings?.fullName ?? "Yamlak Negash"} · {settings?.location ?? "Addis Ababa"} · <span>{clock}</span> {settings?.timezoneLabel ?? "EAT"}
          </span>
          <span>Built with React · Express · MongoDB</span>
          <a className="totop icon-btn" href="#top" aria-label="Back to top">
            <svg className="tring" viewBox="0 0 46 46" aria-hidden="true">
              <circle className="tr" cx="23" cy="23" r="21" />
              <circle className="pr" cx="23" cy="23" r="21" pathLength="1" />
            </svg>
            <svg aria-hidden="true">
              <use href="#i-arrow" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
