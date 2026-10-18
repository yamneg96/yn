import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
  ApproachStep,
  ExperienceItem,
  MessageInput,
  Project,
  SiteSettings,
  SocialLink,
  StackLayer,
  Testimonial,
} from "@/lib/types"

/**
 * Public, read-only content queries for the website.
 *
 * Each query has an exported `*Options` factory so it can also be prefetched, and so
 * cache keys live in one place. Components render from query status: pending -> skeleton,
 * error -> retryable error state, empty array -> empty state, else the data.
 */
export const contentKeys = {
  all: ["content"] as const,
  settings: () => [...contentKeys.all, "settings"] as const,
  projects: () => [...contentKeys.all, "projects"] as const,
  experience: () => [...contentKeys.all, "experience"] as const,
  approach: () => [...contentKeys.all, "approach"] as const,
  stack: () => [...contentKeys.all, "stack"] as const,
  testimonials: () => [...contentKeys.all, "testimonials"] as const,
  socialLinks: () => [...contentKeys.all, "social-links"] as const,
}

export const settingsOptions = () =>
  queryOptions({ queryKey: contentKeys.settings(), queryFn: () => api<SiteSettings>("/settings") })
export const projectsOptions = () =>
  queryOptions({ queryKey: contentKeys.projects(), queryFn: () => api<Project[]>("/projects") })
export const experienceOptions = () =>
  queryOptions({ queryKey: contentKeys.experience(), queryFn: () => api<ExperienceItem[]>("/experience") })
export const approachOptions = () =>
  queryOptions({ queryKey: contentKeys.approach(), queryFn: () => api<ApproachStep[]>("/approach") })
export const stackOptions = () =>
  queryOptions({ queryKey: contentKeys.stack(), queryFn: () => api<StackLayer[]>("/stack") })
export const testimonialsOptions = () =>
  queryOptions({ queryKey: contentKeys.testimonials(), queryFn: () => api<Testimonial[]>("/testimonials") })
export const socialLinksOptions = () =>
  queryOptions({ queryKey: contentKeys.socialLinks(), queryFn: () => api<SocialLink[]>("/social-links") })

export const useSettings = () => useQuery(settingsOptions())
export const useProjects = () => useQuery(projectsOptions())
export const useExperience = () => useQuery(experienceOptions())
export const useApproach = () => useQuery(approachOptions())
export const useStack = () => useQuery(stackOptions())
export const useTestimonials = () => useQuery(testimonialsOptions())
export const useSocialLinks = () => useQuery(socialLinksOptions())

/** Sends a contact request to the CMS inbox (public endpoint; rate-limited and spam-filtered server-side). */
export function useSendMessage() {
  return useMutation({
    mutationFn: (input: MessageInput) => api<{ ok: true }>("/messages", { method: "POST", json: input }),
  })
}
