import { create } from "zustand"

interface UiState {
  /** Mobile navigation drawer. */
  navOpen: boolean
  setNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  navOpen: false,
  setNavOpen: (navOpen) => set({ navOpen }),
}))
