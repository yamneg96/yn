import { toast } from "@/stores/toast"

const COLORS = ["#22d3ee", "#8b5cf6", "#d946ef", "#34d399", "#fbbf24"]

/** 24 small squares burst out of the element: the "copied" moment. */
export function burst(from: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const r = from.getBoundingClientRect()
  for (let i = 0; i < 24; i++) {
    const c = document.createElement("i")
    c.className = "confetti"
    c.style.left = `${r.left + r.width / 2}px`
    c.style.top = `${r.top + r.height / 2}px`
    c.style.background = COLORS[i % COLORS.length]
    c.style.setProperty("--dx", `${Math.random() * 240 - 120}px`)
    c.style.setProperty("--dy", `${Math.random() * -180 - 20}px`)
    c.style.setProperty("--r", `${Math.random() * 540 - 270}deg`)
    document.body.appendChild(c)
    setTimeout(() => c.remove(), 1000)
  }
}

/** Copies the address; if the clipboard is blocked, tells the user to select the visible text instead. */
export async function copyEmail(email: string, from?: HTMLElement) {
  try {
    await navigator.clipboard.writeText(email)
    toast.ok("Email copied to clipboard")
    if (from) burst(from)
  } catch {
    toast.info("Select the address on the page to copy it")
  }
}
