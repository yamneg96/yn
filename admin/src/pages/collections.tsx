import { CollectionPage, type CollectionConfig } from "@/components/admin/CollectionPage"
import { hostOf } from "@/lib/format"

const str = (v: unknown) => (typeof v === "string" ? v : "")
const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : [])

const experience: CollectionConfig = {
  path: "experience",
  noun: "Role",
  title: "Experience",
  description: "The timeline on the portfolio, newest first. Drag order with the arrows.",
  empty: { title: "No roles yet", message: "Add your first role to start the timeline." },
  hasPublished: true,
  defaults: { title: "", company: "", period: "", description: "", tags: [], published: true },
  fields: [
    { key: "title", label: "Job title", type: "text", placeholder: "Lead Full-Stack Developer" },
    { key: "company", label: "Company", type: "text", half: true, placeholder: "NYDev" },
    { key: "period", label: "Period", type: "text", half: true, placeholder: "OCT 2025 — PRESENT" },
    { key: "description", label: "Description", type: "textarea", rows: 5 },
    { key: "tags", label: "Tags", type: "chips", hint: "Shown as chips under the description." },
  ],
  row: (i) => ({ title: str(i.title), subtitle: `${str(i.company)}${i.period ? ` · ${str(i.period)}` : ""}`, chips: list(i.tags) }),
}

const approach: CollectionConfig = {
  path: "approach",
  noun: "Phase",
  title: "Approach",
  description: "The delivery phases cards. Numbering follows the list order.",
  empty: { title: "No phases yet", message: "Describe how you take a system from idea to production." },
  defaults: { title: "", description: "", icon: "layers", color: "#22d3ee" },
  fields: [
    { key: "title", label: "Title", type: "text", placeholder: "Design the system" },
    { key: "description", label: "Description", type: "textarea", rows: 4 },
    {
      key: "icon",
      label: "Icon",
      type: "select",
      half: true,
      options: [
        { value: "layers", label: "Layers" },
        { value: "loop", label: "Loop" },
        { value: "shield", label: "Shield" },
        { value: "flask", label: "Flask" },
      ],
    },
    { key: "color", label: "Accent colour", type: "color", half: true },
  ],
  row: (i) => ({ title: str(i.title), subtitle: str(i.description), color: str(i.color) }),
}

const stack: CollectionConfig = {
  path: "stack",
  noun: "Layer",
  title: "Stack",
  description: "Technology layers. Their items fill the orbit and the marquee on the site.",
  empty: { title: "No layers yet", message: "Group your technologies into layers such as Frontend, Backend and Data." },
  defaults: { name: "", color: "#22d3ee", description: "", items: [] },
  fields: [
    { key: "name", label: "Layer name", type: "text", half: true, placeholder: "Frontend" },
    { key: "color", label: "Colour", type: "color", half: true },
    { key: "description", label: "Description", type: "textarea", rows: 2 },
    { key: "items", label: "Technologies", type: "chips", hint: "Press Enter or comma after each one. The first items appear on the orbit." },
  ],
  row: (i) => ({ title: str(i.name), subtitle: str(i.description), color: str(i.color), chips: list(i.items) }),
}

const testimonials: CollectionConfig = {
  path: "testimonials",
  noun: "Testimonial",
  title: "Testimonials",
  description: "Quotes from collaborators, shown as two scrolling rows.",
  empty: { title: "No testimonials yet", message: "Add a quote from someone you have worked with." },
  defaults: { name: "", role: "", quote: "", avatarUrl: "" },
  fields: [
    { key: "name", label: "Name", type: "text", half: true },
    { key: "role", label: "Role", type: "text", half: true, placeholder: "Developer and Civil Engineer" },
    { key: "quote", label: "Quote", type: "textarea", rows: 5 },
    { key: "avatarUrl", label: "Avatar (optional)", type: "image", hint: "Initials are used when there is no image." },
  ],
  row: (i) => ({ title: str(i.name), subtitle: `${str(i.role) ? `${str(i.role)} · ` : ""}${str(i.quote)}` }),
}

const social: CollectionConfig = {
  path: "social-links",
  noun: "Link",
  title: "Social links",
  description: "Profiles listed in the contact section.",
  empty: { title: "No links yet", message: "Add GitHub, LinkedIn or any profile you want visitors to find." },
  defaults: { platform: "", url: "", note: "" },
  fields: [
    { key: "platform", label: "Platform", type: "text", half: true, placeholder: "GitHub" },
    { key: "url", label: "URL", type: "text", half: true, mono: true, placeholder: "https://github.com/…" },
    { key: "note", label: "Note (optional)", type: "text", hint: "Small text under the name; defaults to the domain." },
  ],
  row: (i) => ({ title: str(i.platform), subtitle: str(i.note) || hostOf(str(i.url)) }),
}

export const ExperiencePage = () => <CollectionPage config={experience} />
export const ApproachPage = () => <CollectionPage config={approach} />
export const StackPage = () => <CollectionPage config={stack} />
export const TestimonialsPage = () => <CollectionPage config={testimonials} />
export const SocialLinksPage = () => <CollectionPage config={social} />
