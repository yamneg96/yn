import { QueryClient } from "@tanstack/react-query"
import { ApiError } from "@/lib/api"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Portfolio content rarely changes: serve from cache for a minute,
      // keep it for 10 before garbage-collecting.
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: false,
      // Don't retry client errors (401/404/400) — only network/5xx blips, once.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < 1
      },
    },
  },
})
