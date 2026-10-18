import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom"
import {
  BriefcaseBusinessIcon,
  ExternalLinkIcon,
  FolderKanbanIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  MessageSquareQuoteIcon,
  MoonIcon,
  RouteIcon,
  SettingsIcon,
  SunIcon,
  XIcon,
} from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLogout, useOverview, useSession } from "@/hooks/use-admin"
import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/theme"
import { useUiStore } from "@/stores/ui"

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { to: "/messages", label: "Messages", icon: MailIcon, badge: true },
  { to: "/projects", label: "Projects", icon: FolderKanbanIcon },
  { to: "/experience", label: "Experience", icon: BriefcaseBusinessIcon },
  { to: "/approach", label: "Approach", icon: RouteIcon },
  { to: "/stack", label: "Stack", icon: LayersIcon },
  { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuoteIcon },
  { to: "/social-links", label: "Social links", icon: LinkIcon },
  { to: "/settings", label: "Site settings", icon: SettingsIcon },
]

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173"

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const overview = useOverview()
  const unread = overview.data?.find((o) => o.key === "messages")?.unread ?? 0
  const session = useSession().data
  const logout = useLogout()
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)

  return (
    <div className="flex h-full flex-col gap-4 bg-sidebar p-3 text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-2 pt-1">
        <span className="grid size-8 place-items-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">YN</span>
        <div className="grid leading-tight">
          <span className="font-heading text-sm font-semibold">Portfolio CMS</span>
          <span className="text-xs text-muted-foreground">Content control room</span>
        </div>
      </div>

      <nav className="grid gap-0.5" aria-label="Sections">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
                isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/80"
              )
            }
          >
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            {badge && unread > 0 && <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-[0.7rem] leading-5 font-semibold text-primary-foreground">{unread}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto grid gap-2 border-t border-sidebar-border pt-3">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <ExternalLinkIcon className="size-4" /> View live site
        </a>
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="min-w-0 truncate text-xs text-muted-foreground" title={session?.email}>
            {session?.email}
          </span>
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon-sm" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={toggle}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Sign out" disabled={logout.isPending} onClick={() => logout.mutate()}>
              <LogOutIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Auth gate + responsive layout. Signed-out visitors are sent to /login. */
export function Shell() {
  const session = useSession()
  const location = useLocation()
  const navOpen = useUiStore((s) => s.navOpen)
  const setNavOpen = useUiStore((s) => s.setNavOpen)

  useEffect(() => setNavOpen(false), [location.pathname, setNavOpen])

  if (session.isPending) {
    return (
      <div className="grid min-h-svh place-items-center">
        <Skeleton className="h-10 w-48 rounded-xl" />
      </div>
    )
  }
  if (!session.data) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-svh border-r lg:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/90 px-3 py-2 backdrop-blur lg:hidden">
        <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setNavOpen(true)}>
          <MenuIcon />
        </Button>
        <span className="font-heading font-semibold">Portfolio CMS</span>
      </header>

      {navOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setNavOpen(false)} />
          <div className="relative h-full w-64 max-w-[85vw] animate-in slide-in-from-left duration-200">
            <Sidebar onNavigate={() => setNavOpen(false)} />
            <Button variant="ghost" size="icon-sm" className="absolute top-3 right-2" aria-label="Close menu" onClick={() => setNavOpen(false)}>
              <XIcon />
            </Button>
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
