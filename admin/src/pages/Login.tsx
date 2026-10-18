import { useState, type FormEvent } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { EyeIcon, EyeOffIcon, LockKeyholeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, TextField } from "@/components/admin/fields"
import { Input } from "@/components/ui/input"
import { useLogin, useSession } from "@/hooks/use-admin"
import { ApiError } from "@/lib/api"

export function Login() {
  const session = useSession()
  const login = useLogin()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState(false)

  if (session.data) return <Navigate to={from} replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => navigate(from, { replace: true }),
        onError: (err) => setError(err instanceof ApiError && err.status === 0 ? err.message : err instanceof Error ? err.message : "Couldn’t sign in."),
      }
    )
  }

  return (
    <div className="grid min-h-svh place-items-center bg-[radial-gradient(60rem_30rem_at_80%_-10%,oklch(0.6_0.2_290/.18),transparent_60%),radial-gradient(50rem_28rem_at_-5%_0%,oklch(0.8_0.13_205/.14),transparent_60%)] px-4">
      <form onSubmit={submit} className="grid w-full max-w-sm gap-5 rounded-2xl border bg-card p-6 shadow-xl" aria-label="Sign in">
        <div className="grid gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyholeIcon className="size-5" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">Portfolio CMS. Authorised access only.</p>
          </div>
        </div>
        <TextField label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" htmlFor="login-password">
          <div className="relative">
            <Input
              id="login-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-9 place-items-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
        </Field>
        {error && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={login.isPending || !email || !password}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
