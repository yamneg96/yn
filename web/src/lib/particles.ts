import { hexToRgb } from "@/lib/format"
import type { ProjectArt } from "@/lib/types"

/**
 * Hero particle stage: one canvas, five scenes (one per featured project's `art`).
 * Switching scenes cross-fades the old layer out while the new one fades in, and
 * each layer keeps the colour it was created with, so the hue shift is smooth.
 */
type DrawFn = (t: number, alpha: number) => void
interface Layer {
  draw: DrawFn
  alpha: number
  out: boolean
  t0: number
}

const rnd = (a: number, b?: number) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a))
const TAU = Math.PI * 2

export type SceneMode = Exclude<ProjectArt, "bars">
export const sceneFor = (art: ProjectArt): SceneMode => (art === "bars" ? "graph" : art)

export class ParticleStage {
  private ctx: CanvasRenderingContext2D
  private W = 0
  private H = 0
  private layers: Layer[] = []
  private visible = true
  private raf = 0
  private observer: IntersectionObserver | null = null
  private reduce: boolean
  private onVisibility = () => {
    this.visible = !document.hidden
  }

  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("2D canvas is not available")
    this.ctx = ctx
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    this.resize()
    this.observer = new IntersectionObserver((e) => {
      this.visible = e[0].isIntersecting
    })
    this.observer.observe(canvas)
    document.addEventListener("visibilitychange", this.onVisibility)
    if (!this.reduce) this.raf = requestAnimationFrame(this.frame)
  }

  resize() {
    const parent = this.canvas.parentElement
    if (!parent) return
    const r = parent.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.W = r.width
    this.H = r.height
    this.canvas.width = this.W * dpr
    this.canvas.height = this.H * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // The live layer closed over the old size: drop everything else and let it keep drawing.
    this.layers = this.layers.filter((l) => !l.out)
  }

  set(mode: SceneMode, hex: string) {
    const color = hexToRgb(hex).join(",")
    const now = performance.now()
    this.layers.forEach((l) => {
      l.out = true
      l.t0 = now
    })
    this.layers.push({ draw: this.make(mode, color), alpha: 0, out: false, t0: now })
    if (this.reduce) {
      this.layers = this.layers.slice(-1)
      this.layers[0].alpha = 1
      this.frame(now, true)
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.observer?.disconnect()
    document.removeEventListener("visibilitychange", this.onVisibility)
  }

  private frame = (now: number, once = false) => {
    if (!once) this.raf = requestAnimationFrame(this.frame)
    if (!this.visible && !once) return
    const { ctx, W, H } = this
    ctx.clearRect(0, 0, W, H)
    this.layers.forEach((l) => {
      const p = Math.min(1, (now - l.t0) / 1200)
      l.alpha = this.reduce ? (l.out ? 0 : 1) : l.out ? 1 - p : p
      if (l.alpha > 0) l.draw(this.reduce ? 0 : now, l.alpha)
    })
    this.layers = this.layers.filter((l) => !(l.out && l.alpha <= 0))
  }

  private make(mode: SceneMode, c: string): DrawFn {
    const { ctx, W, H } = this
    switch (mode) {
      case "pulse": {
        const drops = Array.from({ length: 60 }, () => ({ x: rnd(W), y: rnd(H), r: rnd(1, 3), v: rnd(0.15, 0.6) }))
        const hubs = Array.from({ length: 5 }, () => ({ x: rnd(W * 0.3, W), y: rnd(H * 0.1, H * 0.8), o: rnd(1) }))
        return (t, a) => {
          drops.forEach((p) => {
            p.y -= p.v
            if (p.y < -6) {
              p.y = H + 6
              p.x = rnd(W)
            }
            ctx.fillStyle = `rgba(${c},${0.55 * a})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, TAU)
            ctx.fill()
          })
          hubs.forEach((h) => {
            const ph = (t / 2400 + h.o) % 1
            ctx.strokeStyle = `rgba(${c},${(1 - ph) * 0.5 * a})`
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.arc(h.x, h.y, ph * 130, 0, TAU)
            ctx.stroke()
            ctx.fillStyle = `rgba(${c},${0.9 * a})`
            ctx.beginPath()
            ctx.arc(h.x, h.y, 3, 0, TAU)
            ctx.fill()
          })
        }
      }
      case "hex": {
        const s = 38
        const cells: { x: number; y: number; o: number; on: boolean }[] = []
        let row = 0
        for (let y = -s; y < H + s; y += s * 1.5, row++) {
          for (let x = -s + (row % 2) * s * 0.87; x < W + s; x += s * 1.74) cells.push({ x, y, o: rnd(6.28), on: Math.random() < 0.09 })
        }
        const hx = (cx: number, cy: number) => {
          ctx.beginPath()
          for (let k = 0; k < 6; k++) {
            const an = (Math.PI / 3) * k + Math.PI / 6
            const px = cx + s * 0.86 * Math.cos(an)
            const py = cy + s * 0.86 * Math.sin(an)
            if (k) ctx.lineTo(px, py)
            else ctx.moveTo(px, py)
          }
          ctx.closePath()
        }
        return (t, a) => {
          cells.forEach((q) => {
            hx(q.x, q.y)
            ctx.strokeStyle = `rgba(${c},${0.12 * a})`
            ctx.lineWidth = 1
            ctx.stroke()
            if (q.on) {
              const g = (Math.sin(t / 700 + q.o) + 1) / 2
              ctx.fillStyle = `rgba(${c},${(0.05 + g * 0.22) * a})`
              ctx.fill()
            }
          })
        }
      }
      case "graph": {
        const n = Array.from({ length: 52 }, () => ({ x: rnd(W), y: rnd(H), vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25) }))
        return (_t, a) => {
          n.forEach((p) => {
            p.x += p.vx
            p.y += p.vy
            if (p.x < 0 || p.x > W) p.vx *= -1
            if (p.y < 0 || p.y > H) p.vy *= -1
          })
          for (let i = 0; i < n.length; i++) {
            for (let j = i + 1; j < n.length; j++) {
              const dx = n[i].x - n[j].x
              const dy = n[i].y - n[j].y
              const dd = dx * dx + dy * dy
              if (dd < 19600) {
                ctx.strokeStyle = `rgba(${c},${(1 - dd / 19600) * 0.28 * a})`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(n[i].x, n[i].y)
                ctx.lineTo(n[j].x, n[j].y)
                ctx.stroke()
              }
            }
          }
          n.forEach((p) => {
            ctx.fillStyle = `rgba(${c},${0.7 * a})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, TAU)
            ctx.fill()
          })
        }
      }
      case "stars": {
        const glyphs = ["ሀ", "ለ", "ሐ", "መ", "ሰ", "ቀ", "A", "B", "∑", "π", "λ"]
        const stars = Array.from({ length: 80 }, () => ({ x: rnd(W), y: rnd(H), r: rnd(0.6, 2), o: rnd(6.28) }))
        const text = Array.from({ length: 16 }, (_, i) => ({ x: rnd(W), y: rnd(H), g: glyphs[i % glyphs.length], v: rnd(0.08, 0.3), s: rnd(16, 34) }))
        return (t, a) => {
          stars.forEach((p) => {
            ctx.fillStyle = `rgba(${c},${(0.25 + (Math.sin(t / 600 + p.o) + 1) * 0.25) * a})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, TAU)
            ctx.fill()
          })
          text.forEach((p) => {
            p.y -= p.v
            if (p.y < -30) {
              p.y = H + 30
              p.x = rnd(W)
            }
            ctx.font = `${p.s}px "Noto Sans Ethiopic","Nirmala UI","Inter Variable",sans-serif`
            ctx.fillStyle = `rgba(${c},${0.2 * a})`
            ctx.fillText(p.g, p.x, p.y)
          })
        }
      }
      case "tags": {
        const labels = ["ETB 4,500", "Safe Deal", "ብር", "Verified", "Escrow", "Sold"]
        const tags = Array.from({ length: 16 }, (_, i) => ({ x: rnd(W), y: rnd(H), w: rnd(64, 110), v: rnd(0.12, 0.4), l: labels[i % labels.length], r: rnd(-0.1, 0.1) }))
        return (_t, a) => {
          ctx.font = '500 12px "JetBrains Mono Variable",monospace'
          tags.forEach((p) => {
            p.y += p.v
            p.x += p.v * 0.5
            if (p.y > H + 20) {
              p.y = -30
              p.x = rnd(W)
            }
            if (p.x > W + 120) p.x = -120
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.r)
            ctx.strokeStyle = `rgba(${c},${0.28 * a})`
            ctx.lineWidth = 1
            ctx.beginPath()
            if (ctx.roundRect) ctx.roundRect(0, 0, p.w, 28, 6)
            else ctx.rect(0, 0, p.w, 28)
            ctx.stroke()
            ctx.fillStyle = `rgba(${c},${0.35 * a})`
            ctx.fillText(p.l, 10, 18)
            ctx.restore()
          })
        }
      }
    }
  }
}
