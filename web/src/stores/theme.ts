import { create } from "zustand"

export type Theme = "dark" | "light"
const KEY = "yn-theme"

function read(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    if (t === "light" || t === "dark") return t
  } catch {
    /* storage unavailable: fall through to the default */
  }
  return "dark"
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme)
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

interface ThemeState {
  theme: Theme
  /** Switches theme; with an origin point it plays the circular reveal where supported. */
  toggle: (origin?: { x: number; y: number }) => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: read(),
  toggle: (origin) => {
    const next: Theme = get().theme === "dark" ? "light" : "dark"
    const commit = () => {
      apply(next)
      set({ theme: next })
    }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (origin && doc.startViewTransition && !prefersReducedMotion()) {
      document.documentElement.style.setProperty("--vx", `${origin.x}px`)
      document.documentElement.style.setProperty("--vy", `${origin.y}px`)
      doc.startViewTransition(commit)
    } else {
      commit()
    }
  },
}))

// Keep the attribute in sync on first load (the inline script in index.html already set it).
if (typeof document !== "undefined") apply(useThemeStore.getState().theme)
