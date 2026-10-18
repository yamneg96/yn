import { create } from "zustand"

export type Theme = "dark" | "light"
const KEY = "yn-admin-theme"

function read(): Theme {
  try {
    const t = localStorage.getItem(KEY)
    if (t === "light" || t === "dark") return t
  } catch {
    /* storage unavailable */
  }
  return "dark"
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
}

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: read(),
  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark"
    apply(next)
    set({ theme: next })
  },
}))

if (typeof document !== "undefined") apply(useThemeStore.getState().theme)
