/**
 * Tiny fetch wrapper for the Express API.
 *
 * - In development Vite proxies `/api` and `/uploads` to the backend (see vite.config.ts),
 *   so VITE_API_URL can stay empty and cookies are same-origin.
 * - In production set VITE_API_URL to the deployed API origin; requests are sent with
 *   `credentials: "include"` so the httpOnly auth cookie travels cross-origin.
 */
const BASE_URL: string = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }

  /** Field-level messages from a 400 validation response, e.g. { title: "Required" }. */
  get fieldErrors(): Record<string, string> {
    return this.status === 400 && this.details && typeof this.details === "object"
      ? (this.details as Record<string, string>)
      : {}
  }
}

type ApiInit = Omit<RequestInit, "body"> & { json?: unknown; body?: BodyInit | null }

export async function api<T>(path: string, { json, headers, body, ...init }: ApiInit = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData

  let response: Response
  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      credentials: "include",
      ...init,
      headers: {
        Accept: "application/json",
        ...(json !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : body,
    })
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.")
  }

  if (response.status === 204) return undefined as T

  const payload = await response.json().catch(() => undefined)
  if (!response.ok) {
    throw new ApiError(response.status, payload?.error ?? response.statusText, payload?.details)
  }
  return payload as T
}
