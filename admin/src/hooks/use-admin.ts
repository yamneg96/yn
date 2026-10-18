import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, ApiError } from "@/lib/api"
import type { AdminUser, Message, MessageStatus, MessagesResponse, OverviewItem, SiteSettings } from "@/lib/types"
import { toast } from "@/stores/toast"

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong")

/* ---------------------------------------------------------------- session */

export const sessionOptions = () =>
  queryOptions({
    queryKey: ["session"],
    // 401 is an answer ("signed out"), not a failure.
    queryFn: async (): Promise<AdminUser | null> => {
      try {
        return (await api<{ user: AdminUser }>("/auth/me")).user
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null
        throw e
      }
    },
    staleTime: 5 * 60_000,
  })

export const useSession = () => useQuery(sessionOptions())

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (v: { email: string; password: string }) => api<{ user: AdminUser }>("/auth/login", { method: "POST", json: v }),
    onSuccess: (res) => qc.setQueryData(["session"], res.user),
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api("/auth/logout", { method: "POST" }),
    onSettled: () => {
      qc.clear()
      qc.setQueryData(["session"], null)
    },
  })
}

/* --------------------------------------------------------------- overview */

export const overviewOptions = () =>
  queryOptions({ queryKey: ["overview"], queryFn: () => api<OverviewItem[]>("/admin/overview"), staleTime: 15_000 })
export const useOverview = () => useQuery(overviewOptions())

/* ------------------------------------------------------------ collections */

/** Every content collection shares one CRUD + reorder shape (backend/src/routes/resource.ts). */
export function collectionOptions<T>(path: string) {
  return queryOptions({ queryKey: ["collection", path], queryFn: () => api<T[]>(`/admin/${path}`) })
}
export const useCollection = <T,>(path: string) => useQuery(collectionOptions<T>(path))

export function useCollectionMutations<T extends { id: string }>(path: string, noun: string) {
  const qc = useQueryClient()
  const key = ["collection", path]
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["overview"] })
  }

  const save = useMutation({
    mutationFn: ({ id, body }: { id?: string; body: unknown }) =>
      id ? api<T>(`/admin/${path}/${id}`, { method: "PUT", json: body }) : api<T>(`/admin/${path}`, { method: "POST", json: body }),
    onSuccess: (saved, { id }) => {
      qc.setQueryData<T[]>(key, (old) => (id ? old?.map((x) => (x.id === id ? saved : x)) : [...(old ?? []), saved]))
      refresh()
      toast.success(id ? `${noun} saved` : `${noun} created`)
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/${path}/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key })
      const prev = qc.getQueryData<T[]>(key)
      qc.setQueryData<T[]>(key, (old) => old?.filter((x) => x.id !== id))
      return { prev }
    },
    onError: (e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev)
      toast.error(`Couldn’t delete: ${errorMessage(e)}`)
    },
    onSuccess: () => toast.success(`${noun} deleted`),
    onSettled: refresh,
  })

  const reorder = useMutation({
    mutationFn: (ids: string[]) => api(`/admin/${path}/reorder`, { method: "PUT", json: { ids } }),
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: key })
      const prev = qc.getQueryData<T[]>(key)
      qc.setQueryData<T[]>(key, (old) => (old ? ids.map((id) => old.find((x) => x.id === id)!).filter(Boolean) : old))
      return { prev }
    },
    onError: (e, _ids, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev)
      toast.error(`Couldn’t reorder: ${errorMessage(e)}`)
    },
  })

  return { save, remove, reorder }
}

/* --------------------------------------------------------------- settings */

export const settingsOptions = () => queryOptions({ queryKey: ["settings"], queryFn: () => api<SiteSettings>("/settings") })
export const useSettings = () => useQuery(settingsOptions())

export function useSaveSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: unknown) => api<SiteSettings>("/admin/settings", { method: "PUT", json: body }),
    onSuccess: (saved) => {
      qc.setQueryData(["settings"], saved)
      qc.invalidateQueries({ queryKey: ["overview"] })
      toast.success("Settings saved")
    },
  })
}

/* --------------------------------------------------------------- messages */

export const messagesOptions = (status: MessageStatus | "all") =>
  queryOptions({
    queryKey: ["messages", status],
    queryFn: () => api<MessagesResponse>(`/admin/messages${status === "all" ? "" : `?status=${status}`}`),
    refetchInterval: 60_000,
  })
export const useMessages = (status: MessageStatus | "all") => useQuery(messagesOptions(status))

export function useMessageActions() {
  const qc = useQueryClient()
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["messages"] })
    qc.invalidateQueries({ queryKey: ["overview"] })
  }
  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) => api<Message>(`/admin/messages/${id}`, { method: "PATCH", json: { status } }),
    onSuccess: refresh,
    onError: (e) => toast.error(errorMessage(e)),
  })
  const readAll = useMutation({
    mutationFn: () => api("/admin/messages/read-all", { method: "POST" }),
    onSuccess: () => {
      refresh()
      toast.success("All messages marked as read")
    },
    onError: (e) => toast.error(errorMessage(e)),
  })
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/messages/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      refresh()
      toast.success("Message deleted")
    },
    onError: (e) => toast.error(errorMessage(e)),
  })
  return { setStatus, readAll, remove }
}

/* ----------------------------------------------------------------- upload */

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append("file", file)
      return (await api<{ url: string }>("/admin/upload", { method: "POST", body: form })).url
    },
    onError: (e) => toast.error(`Upload failed: ${errorMessage(e)}`),
  })
}
