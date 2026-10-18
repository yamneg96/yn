import { create } from "zustand"

interface UiState {
  /** Slug of the project whose case file is open, or null. */
  caseSlug: string | null
  /** Element the case file expands from / collapses back into. */
  caseOrigin: HTMLElement | null
  openCase: (slug: string, origin?: HTMLElement | null) => void
  /** Swap to another project without closing (prev/next inside the case file). */
  swapCase: (slug: string) => void
  closeCase: () => void

  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  caseSlug: null,
  caseOrigin: null,
  openCase: (slug, origin = null) => set({ caseSlug: slug, caseOrigin: origin }),
  swapCase: (slug) => set({ caseSlug: slug }),
  closeCase: () => set({ caseSlug: null }),

  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}))
