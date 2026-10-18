import { create } from "zustand"

export type ToastKind = "ok" | "er" | "inf"
export interface Toast {
  id: string
  kind: ToastKind
  message: string
}

interface ToastState {
  toasts: Toast[]
  push: (message: string, kind?: ToastKind) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, kind = "inf") =>
    set((s) => ({ toasts: [...s.toasts, { id: crypto.randomUUID(), kind, message }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  ok: (m: string) => useToastStore.getState().push(m, "ok"),
  error: (m: string) => useToastStore.getState().push(m, "er"),
  info: (m: string) => useToastStore.getState().push(m, "inf"),
}
