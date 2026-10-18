import { z } from "zod";
import { APPROACH_ICONS, MESSAGE_STATUSES, MESSAGE_TOPICS, PROJECT_ART, PROJECT_CATEGORIES } from "../models";

/** Trims; an empty string means "not provided" and becomes undefined (so PUT can clear the field). */
const optionalText = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : undefined));

const text = (label = "Required") => z.string().trim().min(1, label);
const order = z.coerce.number().int().default(0);
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #22d3ee");
const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only");
const stringList = z.array(z.string().trim().min(1)).default([]);
const url = optionalText.refine((v) => v === undefined || /^(https?:\/\/|\/)/i.test(v), "Must start with https:// or /");

const metric = z.object({
  value: z.coerce.number(),
  suffix: z.string().trim().default(""),
  label: text("Label is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const settingsSchema = z.object({
  fullName: text(),
  initials: z.string().trim().min(1).max(3),
  location: z.string().trim().default(""),
  coordinates: z.string().trim().default(""),
  timezone: z.string().trim().default("Africa/Addis_Ababa"),
  timezoneLabel: z.string().trim().default("EAT"),
  availability: z.string().trim().default(""),
  available: z.boolean().default(true),
  heroTitle: text(),
  heroHighlight: z.string().trim().default(""),
  heroRoles: stringList,
  heroSubtitle: text(),
  heroImageUrl: optionalText,
  resumeUrl: optionalText,
  stats: z.array(metric).max(6).default([]),
  email: optionalText,
  phone: optionalText,
  aboutHeading: z.string().trim().default(""),
  aboutIntro: z.string().trim().default(""),
  principle: z.string().trim().default(""),
  principleTags: stringList,
  dailyStack: stringList,
  timezoneNote: z.string().trim().default(""),
  learningNote: z.string().trim().default(""),
  insideScoop: z.string().trim().default(""),
  scoopRole: z.string().trim().default(""),
  scoopSince: z.string().trim().default(""),
  ctaHeading: z.string().trim().default(""),
  contactHeading: z.string().trim().default(""),
  contactHighlight: z.string().trim().default(""),
  contactIntro: z.string().trim().default(""),
  educationSchool: z.string().trim().default(""),
  educationDegree: z.string().trim().default(""),
  languages: z.string().trim().default(""),
});

export const projectSchema = z.object({
  slug: slug.optional(),
  title: text(),
  name: text(),
  summary: text(),
  kind: z.string().trim().default("Web"),
  role: z.string().trim().default(""),
  categories: z.array(z.enum(PROJECT_CATEGORIES)).default([]),
  accent: hex.default("#22d3ee"),
  accent2: hex.default("#6366f1"),
  art: z.enum(PROJECT_ART).default("graph"),
  coverImageUrl: url,
  featured: z.boolean().default(false),
  overview: z.string().trim().default(""),
  challenge: z.string().trim().default(""),
  solution: z.string().trim().default(""),
  outcome: optionalText,
  features: stringList,
  stack: stringList,
  metrics: z.array(metric).max(6).default([]),
  arch: z
    .object({ clients: stringList, api: z.string().trim().default(""), back: stringList })
    .default({ clients: [], api: "", back: [] }),
  liveUrl: url,
  sourceUrl: url,
  adminUrl: url,
  mobileUrl: url,
  embedMode: z.enum(["live", "blocked", "down"]).default("live"),
  embedNote: optionalText,
  order,
  published: z.boolean().default(true),
});

export const experienceSchema = z.object({
  title: text(),
  company: z.string().trim().default(""),
  period: z.string().trim().default(""),
  description: text(),
  tags: stringList,
  order,
  published: z.boolean().default(true),
});

export const approachStepSchema = z.object({
  title: text(),
  description: text(),
  icon: z.enum(APPROACH_ICONS).default("layers"),
  color: hex.default("#22d3ee"),
  order,
});

export const stackLayerSchema = z.object({
  name: text(),
  color: hex.default("#22d3ee"),
  description: z.string().trim().default(""),
  items: stringList,
  order,
});

export const testimonialSchema = z.object({
  name: text(),
  role: optionalText,
  quote: text(),
  avatarUrl: optionalText,
  order,
});

export const socialLinkSchema = z.object({
  platform: text(),
  url: text(),
  note: optionalText,
  iconUrl: optionalText,
  order,
});

/** Public contact-form submission. `website` is a honeypot: humans never see or fill it. */
export const messageSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(160),
  topic: z.enum(MESSAGE_TOPICS).default("project"),
  message: z.string().trim().min(10, "Add a few more details (at least 10 characters)").max(4000, "Keep it under 4000 characters"),
  website: z.string().optional(),
});

export const messageStatusSchema = z.object({ status: z.enum(MESSAGE_STATUSES) });

export const reorderSchema = z.object({ ids: z.array(z.string()).min(1) });

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
