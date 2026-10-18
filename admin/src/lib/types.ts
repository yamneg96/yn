/** Shapes returned by the Express API (see backend/README.md). Keep in sync with backend/src/validation. */

export interface Timestamps {
  createdAt?: string
  updatedAt?: string
}

export interface Metric {
  value: number
  suffix: string
  label: string
}

export interface SiteSettings extends Timestamps {
  id: string | null
  fullName: string
  initials: string
  location: string
  coordinates: string
  timezone: string
  timezoneLabel: string
  availability: string
  available: boolean
  heroTitle: string
  heroHighlight: string
  heroRoles: string[]
  heroSubtitle: string
  heroImageUrl?: string
  resumeUrl?: string
  stats: Metric[]
  email?: string
  phone?: string
  aboutHeading: string
  aboutIntro: string
  principle: string
  principleTags: string[]
  dailyStack: string[]
  timezoneNote: string
  learningNote: string
  insideScoop: string
  scoopRole: string
  scoopSince: string
  ctaHeading: string
  contactHeading: string
  contactHighlight: string
  contactIntro: string
  educationSchool: string
  educationDegree: string
  languages: string
}

export type ProjectCategory = "fintech" | "health" | "edtech" | "market" | "ai" | "mobile"
export type ProjectArt = "pulse" | "hex" | "graph" | "stars" | "tags" | "bars"
export type EmbedMode = "live" | "blocked" | "down"

export interface Architecture {
  clients: string[]
  api: string
  back: string[]
}

export interface Project extends Timestamps {
  id: string
  slug: string
  title: string
  name: string
  summary: string
  kind: string
  role: string
  categories: ProjectCategory[]
  accent: string
  accent2: string
  art: ProjectArt
  coverImageUrl?: string
  featured: boolean
  overview: string
  challenge: string
  solution: string
  outcome?: string
  features: string[]
  stack: string[]
  metrics: Metric[]
  arch: Architecture
  liveUrl?: string
  sourceUrl?: string
  adminUrl?: string
  mobileUrl?: string
  embedMode: EmbedMode
  embedNote?: string
  order: number
  published: boolean
}

export interface ExperienceItem extends Timestamps {
  id: string
  title: string
  company: string
  period: string
  description: string
  tags: string[]
  order: number
  published: boolean
}

export type ApproachIcon = "layers" | "loop" | "shield" | "flask"

export interface ApproachStep extends Timestamps {
  id: string
  title: string
  description: string
  icon: ApproachIcon
  color: string
  order: number
}

export interface StackLayer extends Timestamps {
  id: string
  name: string
  color: string
  description: string
  items: string[]
  order: number
}

export interface Testimonial extends Timestamps {
  id: string
  name: string
  role?: string
  quote: string
  avatarUrl?: string
  order: number
}

export interface SocialLink extends Timestamps {
  id: string
  platform: string
  url: string
  note?: string
  iconUrl?: string
  order: number
}

export type MessageTopic = "project" | "job" | "collab" | "other"

/** What the contact form sends. `website` is a hidden honeypot and must stay empty. */
export interface MessageInput {
  name: string
  email: string
  topic: MessageTopic
  message: string
  website?: string
}

export type MessageStatus = "new" | "read" | "archived"

export interface Message extends Timestamps {
  id: string
  name: string
  email: string
  topic: MessageTopic
  message: string
  status: MessageStatus
  readAt?: string
  userAgent?: string
}

export interface MessagesResponse {
  items: Message[]
  unread: number
}

export interface OverviewItem {
  key: string
  label: string
  href: string
  count: number
  updatedAt: string | null
  unread?: number
}

export interface AdminUser {
  id: string
  email: string
}

export const PROJECT_CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
  { value: "fintech", label: "Fintech" },
  { value: "health", label: "Health" },
  { value: "edtech", label: "EdTech" },
  { value: "market", label: "Marketplace" },
  { value: "ai", label: "AI" },
  { value: "mobile", label: "Mobile" },
]
