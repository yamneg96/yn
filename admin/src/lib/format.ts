import type { MessageTopic } from "./types"

export const TOPIC_LABEL: Record<MessageTopic, string> = {
  project: "A project",
  job: "A role",
  collab: "Collaboration",
  other: "Something else",
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
]
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

/** "3 hours ago", "yesterday"… */
export function timeAgo(iso?: string | null): string {
  if (!iso) return ""
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return "just now"
}

export function fullDate(iso?: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}
