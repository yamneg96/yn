import { escapeHtml } from "@/lib/format"
import type { Project } from "@/lib/types"

/**
 * Generated artwork for projects: gradients plus a motif per `art` type, so every
 * project has a cover without needing screenshots. Returns SVG markup; inputs are
 * the project's hex colours (validated by the API) and its escaped name.
 */
type ArtProject = Pick<Project, "slug" | "name" | "accent" | "accent2" | "art">

export function coverSvg(p: ArtProject, big = false): string {
  const a = p.accent
  const b = p.accent2
  const id = `g${p.slug.replace(/[^a-z0-9]/gi, "")}${big ? "b" : ""}`
  let s = ""
  s += `<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(p.name)} artwork">`
  s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050816"/><stop offset="1" stop-color="${a}" stop-opacity=".28"/></linearGradient>`
  s += `<radialGradient id="${id}r" cx=".75" cy=".2" r=".7"><stop offset="0" stop-color="${a}" stop-opacity=".55"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>`
  s += `<pattern id="${id}p" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${b}" stroke-opacity=".12"/></pattern></defs>`
  s += `<rect width="640" height="400" fill="#050816"/><rect width="640" height="400" fill="url(#${id})"/><rect width="640" height="400" fill="url(#${id}p)"/><rect width="640" height="400" fill="url(#${id}r)"/>`

  switch (p.art) {
    case "pulse": {
      for (let i = 0; i < 4; i++) {
        const cx = 150 + i * 120
        const cy = 120 + (i % 2) * 120
        s += `<circle cx="${cx}" cy="${cy}" r="${14 + i * 6}" fill="none" stroke="${a}" stroke-opacity="${0.7 - i * 0.12}"/><circle cx="${cx}" cy="${cy}" r="${34 + i * 12}" fill="none" stroke="${a}" stroke-opacity=".22"/><circle cx="${cx}" cy="${cy}" r="4" fill="${a}"/>`
      }
      s += `<path d="M150 120 270 240 390 120 510 240" fill="none" stroke="${b}" stroke-opacity=".6" stroke-dasharray="4 6"/>`
      break
    }
    case "hex": {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 8; c++) {
          const x = 70 + c * 70 + (r % 2) * 35
          const y = 60 + r * 62
          const on = (r * 3 + c * 5) % 7 === 0
          s += `<path d="M${x} ${y - 30}l26 15v30l-26 15-26-15v-30z" fill="${on ? a : "none"}" fill-opacity=".28" stroke="${a}" stroke-opacity="${on ? 0.9 : 0.25}"/>`
        }
      }
      s += `<rect x="278" y="168" width="84" height="64" rx="10" fill="#050816" stroke="${a}"/><path d="M300 168v-18a22 22 0 0 1 44 0v18" fill="none" stroke="${a}" stroke-width="3"/><circle cx="320" cy="200" r="7" fill="${a}"/>`
      break
    }
    case "graph": {
      const pts = [[90, 300], [190, 150], [300, 250], [400, 110], [520, 230], [560, 90], [330, 330], [470, 340]]
      const ed = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [4, 7], [1, 3]]
      ed.forEach((e) => {
        s += `<line x1="${pts[e[0]][0]}" y1="${pts[e[0]][1]}" x2="${pts[e[1]][0]}" y2="${pts[e[1]][1]}" stroke="${b}" stroke-opacity=".55"/>`
      })
      pts.forEach((q, j) => {
        s += `<circle cx="${q[0]}" cy="${q[1]}" r="${j % 3 ? 7 : 12}" fill="#050816" stroke="${a}" stroke-width="2"/><circle cx="${q[0]}" cy="${q[1]}" r="3" fill="${a}"/>`
      })
      break
    }
    case "stars": {
      const glyphs = ["ሀ", "ለ", "መ", "A", "∑", "ሰ", "B", "π", "ቀ"]
      for (let i = 0; i < 30; i++) {
        s += `<circle cx="${(i * 97) % 600 + 20}" cy="${(i * 53) % 360 + 20}" r="${1 + (i % 3)}" fill="${i % 4 ? b : a}" fill-opacity="${0.35 + (i % 5) * 0.12}"/>`
      }
      glyphs.forEach((g, j) => {
        s += `<text x="${60 + j * 62}" y="${110 + (j % 3) * 90}" font-size="${26 + (j % 3) * 12}" fill="${a}" fill-opacity=".5" font-family="sans-serif">${g}</text>`
      })
      s += `<path d="M80 300 200 220 330 270 470 170 570 210" fill="none" stroke="${b}" stroke-opacity=".5"/>`
      break
    }
    case "tags": {
      const tags = ["Safe Deal", "ETB 4,500", "ብር", "Verified", "Escrow", "Chat", "Telegram", "Sold"]
      tags.forEach((t, j) => {
        const x = 50 + (j % 4) * 150
        const y = 70 + Math.floor(j / 4) * 130 + (j % 2) * 24
        s += `<g transform="rotate(${(j % 3) * 4 - 4} ${x} ${y})"><rect x="${x}" y="${y}" width="124" height="44" rx="8" fill="#050816" stroke="${a}" stroke-opacity=".7"/><circle cx="${x + 14}" cy="${y + 22}" r="4" fill="${a}"/><text x="${x + 28}" y="${y + 27}" font-size="14" fill="#eaf2ff" font-family="monospace">${t}</text></g>`
      })
      break
    }
    default: {
      for (let i = 0; i < 9; i++) {
        const h = 40 + ((i * 47) % 150)
        s += `<rect x="${70 + i * 56}" y="${330 - h}" width="34" height="${h}" rx="4" fill="${a}" fill-opacity="${0.25 + (i % 4) * 0.15}"/>`
      }
      s += `<path d="M70 250 160 210 240 230 330 150 420 180 570 90" fill="none" stroke="${b}" stroke-width="2.5"/>`
    }
  }

  if (big) {
    s += `<text x="36" y="44" font-family="monospace" font-size="15" fill="#eaf2ff" fill-opacity=".7" letter-spacing="3">${escapeHtml(p.name.toUpperCase())}</text>`
  }
  return s + "</svg>"
}

export function mockWebSvg(p: Pick<Project, "accent">): string {
  const a = p.accent
  let s =
    '<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice"><rect width="640" height="400" fill="#050816"/><rect x="40" y="40" width="560" height="320" rx="14" fill="#0a0f1f" stroke="#223" /><rect x="40" y="40" width="560" height="34" rx="14" fill="#101830"/><circle cx="62" cy="57" r="5" fill="#fb7185"/><circle cx="80" cy="57" r="5" fill="#fbbf24"/><circle cx="98" cy="57" r="5" fill="#34d399"/><rect x="130" y="49" width="260" height="16" rx="8" fill="#0a0f1f"/><rect x="60" y="92" width="110" height="250" rx="8" fill="#0d1428"/>'
  for (let i = 0; i < 5; i++) {
    s += `<rect x="72" y="${108 + i * 34}" width="86" height="12" rx="6" fill="${i === 0 ? a : "#1b2547"}" fill-opacity="${i === 0 ? 0.9 : 1}"/>`
  }
  for (let i = 0; i < 3; i++) {
    s += `<rect x="${190 + i * 136}" y="92" width="124" height="64" rx="8" fill="#0d1428" stroke="${a}" stroke-opacity=".35"/><rect x="${202 + i * 136}" y="108" width="50" height="10" rx="5" fill="#1b2547"/><rect x="${202 + i * 136}" y="126" width="72" height="16" rx="5" fill="${a}" fill-opacity=".8"/>`
  }
  s += `<rect x="190" y="172" width="396" height="170" rx="8" fill="#0d1428"/><path d="M204 320 270 280 330 300 400 232 470 262 570 196" fill="none" stroke="${a}" stroke-width="3"/><path d="M204 320 270 280 330 300 400 232 470 262 570 196V330H204Z" fill="${a}" fill-opacity=".12"/></svg>`
  return s
}

export function mockPhoneSvg(p: Pick<Project, "accent">): string {
  const a = p.accent
  let s = '<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice"><rect width="640" height="400" fill="#050816"/>'
  const phones: [number, number, number][] = [[130, -10, 0.55], [270, 10, 1], [410, -10, 0.55]]
  phones.forEach((q) => {
    s += `<g transform="translate(${q[0]},${30 + q[1]})" opacity="${q[2]}"><rect width="100" height="340" rx="16" fill="#0a0f1f" stroke="#2a3558" stroke-width="2"/><rect x="36" y="8" width="28" height="6" rx="3" fill="#050816"/><rect x="12" y="30" width="76" height="46" rx="8" fill="${a}" fill-opacity=".85"/>`
    for (let i = 0; i < 4; i++) {
      s += `<rect x="12" y="${92 + i * 36}" width="76" height="26" rx="6" fill="#101830"/><circle cx="24" cy="${105 + i * 36}" r="6" fill="${a}" fill-opacity="${0.9 - i * 0.2}"/><rect x="36" y="${100 + i * 36}" width="40" height="5" rx="2" fill="#26325a"/><rect x="36" y="${109 + i * 36}" width="28" height="4" rx="2" fill="#1b2547"/>`
    }
    s += "</g>"
  })
  return s + "</svg>"
}

/** Animated-in architecture diagram: clients -> API -> back-end services. */
export function archSvg(p: Pick<Project, "name" | "arch">): string {
  const A = p.arch
  const W = 640
  const H = Math.max(240, Math.max(A.clients.length, A.back.length) * 74 + 40)
  const cy = H / 2
  let lines = ""
  let boxes = ""
  const box = (x: number, yy: number, w: number, label: string, core: boolean, delay: number) =>
    `<g class="nd${core ? " core" : ""}" style="animation-delay:${delay}ms"><rect x="${x}" y="${yy}" width="${w}" height="46" rx="8"/><text x="${x + w / 2}" y="${yy + 28}" text-anchor="middle">${escapeHtml(label)}</text></g>`

  A.clients.forEach((c, k) => {
    const py = (H / (A.clients.length + 1)) * (k + 1) - 23
    boxes += box(10, py, 150, c, false, 100 + k * 90)
    lines += `<path class="ln go" pathLength="1" d="M160 ${py + 23} C205 ${py + 23} 205 ${cy} 250 ${cy}" style="animation-delay:${300 + k * 90}ms"/>`
  })
  boxes += box(250, cy - 23, 140, A.api || "API", true, 280)
  A.back.forEach((c, k) => {
    const py = (H / (A.back.length + 1)) * (k + 1) - 23
    boxes += box(480, py, 150, c, false, 480 + k * 90)
    lines += `<path class="ln go" pathLength="1" d="M390 ${cy} C435 ${cy} 435 ${py + 23} 480 ${py + 23}" style="animation-delay:${620 + k * 90}ms"/>`
  })
  const startY = H / (A.clients.length + 1)
  return (
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Architecture of ${escapeHtml(p.name)}">` +
    lines +
    boxes +
    `<circle class="pulse" r="3.5"><animateMotion dur="3.2s" repeatCount="indefinite" path="M160 ${startY} C205 ${cy} 205 ${cy} 250 ${cy} L390 ${cy}"/></circle></svg>`
  )
}
