import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Icon } from "./Icon"
import { useThemeStore } from "@/stores/theme"
import { useUiStore } from "@/stores/ui"

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "words", label: "Testimonials" },
  { id: "contact", label: "Contact" },
]

export function Nav({ initials = "YN", resumeUrl }: { initials?: string; resumeUrl?: string }) {
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const linksRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggle)
  const menuOpen = useUiStore((s) => s.menuOpen)
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 160 && !useUiStore.getState().menuOpen)
      last = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll-spy.
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const placePill = useCallback(() => {
    const a = active ? itemRefs.current[active] : null
    setPill(a ? { left: a.offsetLeft + 12, width: a.offsetWidth - 24 } : { left: 0, width: 0 })
  }, [active])
  useLayoutEffect(placePill, [placePill])
  useEffect(() => {
    window.addEventListener("resize", placePill)
    return () => window.removeEventListener("resize", placePill)
  }, [placePill])

  // Lock page scroll behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <header className={`nav${hidden ? " hide" : ""}`} id="nav">
        <div className="nav-bar">
          <a href="#top" className="mono-logo" aria-label="Back to top">
            {initials}
          </a>
          <nav className="nav-links" aria-label="Primary" ref={linksRef}>
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                ref={(el) => {
                  itemRefs.current[l.id] = el
                }}
                aria-current={active === l.id ? "true" : "false"}
              >
                {l.label}
              </a>
            ))}
            <span className="nav-pill" aria-hidden="true" style={{ left: pill.left, width: pill.width }} />
          </nav>
          <div className="nav-actions">
            {resumeUrl && (
              <a className="btn btn-ghost" href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Résumé <Icon name="down" />
              </a>
            )}
            <button
              type="button"
              className="icon-btn theme-ico"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
              }}
            >
              <Icon name="moon" className="moon" />
              <Icon name="sun" className="sun" />
            </button>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "x" : "menu"} />
            </button>
          </div>
          <span className="nav-progress" aria-hidden="true" />
        </div>
      </header>
      {menuOpen && (
        <div className="menu" id="menu">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
