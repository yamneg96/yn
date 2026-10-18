export function hostOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function pathOf(url: string): string {
  try {
    const u = new URL(url)
    return (u.pathname === "/" ? "" : u.pathname) + u.search
  } catch {
    return ""
  }
}

/** Two-letter monogram for a technology name ("React Native" -> "RN", "Node.js" -> "NO"). */
export function mono(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean)
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase()
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }
    return map[c]
  })
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

/** Clock string for a given IANA timezone, e.g. "17:57". */
export function clockIn(timeZone: string): string {
  try {
    return new Date().toLocaleTimeString("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" })
  } catch {
    return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  }
}

/** Splits `title` around `highlight` so the highlighted part can be styled. */
export function splitHighlight(title: string, highlight: string): [string, string, string] {
  const i = highlight ? title.indexOf(highlight) : -1
  if (i < 0) return [title, "", ""]
  return [title.slice(0, i), highlight, title.slice(i + highlight.length)]
}
