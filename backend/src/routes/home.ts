import { Router } from "express";
import mongoose from "mongoose";

type Access = "public" | "admin";
interface Endpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  access: Access;
  note: string;
}
interface Group {
  title: string;
  blurb: string;
  endpoints: Endpoint[];
}

/** CRUD + reorder routes that every content collection shares (see routes/resource.ts). */
const crud = (base: string, noun: string, publicRead = true): Endpoint[] => [
  ...(publicRead ? [{ method: "GET", path: `/api/${base}`, access: "public", note: `List published ${noun}, in display order.` } as Endpoint] : []),
  { method: "GET", path: `/api/admin/${base}`, access: "admin", note: `List all ${noun}, including drafts.` },
  { method: "POST", path: `/api/admin/${base}`, access: "admin", note: `Create one of the ${noun}.` },
  { method: "PUT", path: `/api/admin/${base}/:id`, access: "admin", note: "Replace it; cleared optional fields are unset." },
  { method: "DELETE", path: `/api/admin/${base}/:id`, access: "admin", note: "Delete it." },
  { method: "PUT", path: `/api/admin/${base}/reorder`, access: "admin", note: "Save a new order from an array of ids." },
];

const GROUPS: Group[] = [
  {
    title: "Service",
    blurb: "Health and authentication.",
    endpoints: [
      { method: "GET", path: "/api/health", access: "public", note: "Uptime and database connection state." },
      { method: "POST", path: "/api/auth/login", access: "public", note: "Sign in. Sets the httpOnly session cookie; no token is returned." },
      { method: "POST", path: "/api/auth/logout", access: "public", note: "Clears the session cookie." },
      { method: "GET", path: "/api/auth/me", access: "admin", note: "The signed-in admin, or 401." },
      { method: "GET", path: "/api/admin/overview", access: "admin", note: "Counts for the dashboard, including unread messages." },
    ],
  },
  {
    title: "Site settings",
    blurb: "One document: hero, stats, about, contact and education copy.",
    endpoints: [
      { method: "GET", path: "/api/settings", access: "public", note: "Settings merged over built-in defaults." },
      { method: "PUT", path: "/api/admin/settings", access: "admin", note: "Update settings." },
    ],
  },
  { title: "Projects", blurb: "Case files: overview, stack, metrics, architecture, live URL and embed mode.", endpoints: crud("projects", "projects") },
  { title: "Experience", blurb: "Timeline entries.", endpoints: crud("experience", "roles") },
  { title: "Approach", blurb: "The four delivery phases.", endpoints: crud("approach", "steps") },
  { title: "Stack", blurb: "Technology layers that feed the orbit.", endpoints: crud("stack", "layers") },
  { title: "Testimonials", blurb: "Quotes from collaborators.", endpoints: crud("testimonials", "testimonials") },
  { title: "Social links", blurb: "Profiles shown in the contact section.", endpoints: crud("social-links", "links") },
  {
    title: "Messages",
    blurb: "Contact-form requests from the portfolio land in the admin inbox.",
    endpoints: [
      { method: "POST", path: "/api/messages", access: "public", note: "Send a message. Validated, rate-limited to 5 per hour, honeypot-filtered." },
      { method: "GET", path: "/api/admin/messages", access: "admin", note: "Inbox. Filter with ?status=new|read|archived; returns the unread count." },
      { method: "POST", path: "/api/admin/messages/read-all", access: "admin", note: "Mark every new message as read." },
      { method: "PATCH", path: "/api/admin/messages/:id", access: "admin", note: "Set status to new, read or archived." },
      { method: "DELETE", path: "/api/admin/messages/:id", access: "admin", note: "Delete a message." },
    ],
  },
  {
    title: "Uploads",
    blurb: "Images for covers and avatars.",
    endpoints: [{ method: "POST", path: "/api/admin/upload", access: "admin", note: "Multipart image upload (field \"file\"). Stored on Vercel Blob, or /uploads locally." }],
  },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(): string {
  const dbState = ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] ?? "unknown";
  const dbOk = dbState === "connected";
  const total = GROUPS.reduce((n, g) => n + g.endpoints.length, 0);
  const uptime = Math.round(process.uptime());

  const groups = GROUPS.map(
    (g, i) => `
    <details class="grp"${i < 2 ? " open" : ""}>
      <summary><span class="gt">${esc(g.title)}</span><span class="gb">${esc(g.blurb)}</span><span class="gc">${g.endpoints.length}</span></summary>
      <ul>${g.endpoints
        .map(
          (e) => `
        <li><span class="m ${e.method}">${e.method}</span><code>${esc(e.path)}</code><span class="acc ${e.access}">${e.access === "admin" ? "admin" : "public"}</span><span class="n">${esc(e.note)}</span></li>`
        )
        .join("")}
      </ul>
    </details>`
  ).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="data:,">
<title>Portfolio API · Yamlak Negash</title>
<meta name="description" content="REST API behind the portfolio site and its content management system.">
<style>
:root{--bg:#04060f;--bg2:#0a0f1f;--line:rgba(120,160,255,.18);--fg:#eaf2ff;--fg2:#9fb0d0;--fg3:#7888aa;--cyan:#22d3ee;--violet:#8b5cf6;--mint:#34d399;--rose:#fb7185;--amber:#fbbf24;--blue:#60a5fa;color-scheme:dark}
@media(prefers-color-scheme:light){:root{--bg:#f5f8ff;--bg2:#ffffff;--line:rgba(30,50,110,.16);--fg:#0b1226;--fg2:#3c4b6e;--fg3:#5d6c90;--cyan:#0e7490;--violet:#6d28d9;--mint:#047857;--rose:#be123c;--amber:#a16207;--blue:#1d4ed8;color-scheme:light}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:400 1rem/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
background-image:radial-gradient(60rem 30rem at 85% -10%,rgba(139,92,246,.18),transparent 60%),radial-gradient(50rem 28rem at -5% 0%,rgba(34,211,238,.14),transparent 60%);background-repeat:no-repeat}
.wrap{width:min(1000px,100% - 32px);margin-inline:auto;padding-block:clamp(36px,7vw,80px)}
code,.m,.mono{font-family:ui-monospace,"Cascadia Code",Consolas,monospace}
.eyebrow{font:500 .72rem/1 ui-monospace,Consolas,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan)}
h1{font-size:clamp(2.2rem,6vw,4rem);line-height:1.05;letter-spacing:-.03em;margin:16px 0 14px;text-wrap:balance}
h1 span{background:linear-gradient(90deg,var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{color:var(--fg2);max-width:62ch;margin:0}
.status{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0 0}
.pill{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid var(--line);border-radius:999px;background:var(--bg2);font:500 .8rem ui-monospace,Consolas,monospace;color:var(--fg2)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 0 var(--mint);animation:p 2s infinite}
.dot.bad{background:var(--rose);animation:none}
@keyframes p{70%{box-shadow:0 0 0 7px transparent}}
@media(prefers-reduced-motion:reduce){.dot{animation:none}}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px;margin:38px 0}
.card{padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--bg2)}
.card h3{margin:0 0 6px;font-size:1rem}
.card p{margin:0;color:var(--fg2);font-size:.92rem}
.card .k{font:500 .68rem ui-monospace,Consolas,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--violet);display:block;margin-bottom:8px}
h2{font-size:1.5rem;letter-spacing:-.02em;margin:46px 0 6px}
.sub{color:var(--fg2);margin:0 0 18px}
.grp{border:1px solid var(--line);border-radius:14px;background:var(--bg2);margin-bottom:10px;overflow:hidden}
.grp summary{display:grid;grid-template-columns:auto 1fr auto;gap:6px 16px;align-items:baseline;padding:14px 16px;cursor:pointer;list-style:none}
.grp summary::-webkit-details-marker{display:none}
.grp summary:focus-visible{outline:2px solid var(--cyan);outline-offset:-2px}
.gt{font-weight:600}.gb{color:var(--fg3);font-size:.88rem;min-width:0}
.gc{font:500 .75rem ui-monospace,Consolas,monospace;color:var(--fg3);border:1px solid var(--line);border-radius:999px;padding:2px 9px}
.grp ul{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.grp li{display:grid;grid-template-columns:62px minmax(0,auto) auto 1fr;gap:6px 12px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line);font-size:.9rem}
.grp li:last-child{border-bottom:0}
.m{font-size:.72rem;font-weight:700;text-align:center;border-radius:6px;padding:3px 0;border:1px solid currentColor}
.GET{color:var(--mint)}.POST{color:var(--blue)}.PUT{color:var(--amber)}.PATCH{color:var(--violet)}.DELETE{color:var(--rose)}
li code{font-size:.84rem;overflow-wrap:anywhere}
.acc{font:600 .66rem ui-monospace,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase;padding:2px 8px;border-radius:999px;border:1px solid var(--line);color:var(--fg3)}
.acc.admin{color:var(--amber);border-color:currentColor}
.n{color:var(--fg2)}
@media(max-width:720px){.grp li{grid-template-columns:62px 1fr}.grp li .acc{justify-self:start}.grp li .n{grid-column:1/-1}.grp summary{grid-template-columns:1fr auto}.gb{grid-column:1/-1;order:3}}
pre{margin:0;padding:16px;border:1px solid var(--line);border-radius:14px;background:var(--bg2);overflow-x:auto;font-size:.84rem;line-height:1.6}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:14px}
.lbl{font:500 .7rem ui-monospace,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin:0 0 8px}
ul.notes{margin:0;padding-left:1.1em;color:var(--fg2)}ul.notes li{margin:6px 0}
footer{margin-top:56px;padding-top:20px;border-top:1px solid var(--line);color:var(--fg3);font-size:.86rem;display:flex;flex-wrap:wrap;gap:8px 20px;justify-content:space-between}
a{color:var(--cyan)}
</style>
</head>
<body>
<main class="wrap">
  <div class="eyebrow">REST API · v1</div>
  <h1>The engine behind <span>yamlak.vercel.app</span></h1>
  <p class="lead">Express and MongoDB service that feeds the public portfolio, powers the admin CMS, and receives contact requests. Public routes are read-only; everything under <code>/api/admin</code> needs a signed-in session.</p>
  <div class="status" aria-label="Live status">
    <span class="pill"><span class="dot${dbOk ? "" : " bad"}"></span>API online</span>
    <span class="pill">database: ${dbState}</span>
    <span class="pill">uptime ${uptime}s</span>
    <span class="pill">${total} endpoints</span>
    <span class="pill"><a href="/api/health">/api/health</a></span>
  </div>

  <div class="cards">
    <div class="card"><span class="k">Public</span><h3>Read-only content</h3><p>Settings, projects, experience, approach, stack, testimonials and social links, plus one write: sending a message.</p></div>
    <div class="card"><span class="k">Admin</span><h3>Full CMS</h3><p>Create, edit, delete and reorder every collection, upload images, and manage the contact inbox.</p></div>
    <div class="card"><span class="k">Security</span><h3>Cookie session</h3><p>JWT in an httpOnly cookie, Zod validation, helmet, CORS allow-list, and rate limits on login and messages.</p></div>
  </div>

  <h2>Endpoints</h2>
  <p class="sub">Open a group to see its routes. Paths are relative to this origin.</p>
  ${groups}

  <h2>Quick start</h2>
  <div class="two">
    <div><p class="lbl">Read the published projects</p><pre># export API=http://localhost:5000
curl ${"$"}API/api/projects</pre></div>
    <div><p class="lbl">Send a message from anywhere</p><pre>curl -X POST ${"$"}API/api/messages \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada","email":"ada@example.com",
       "topic":"project","message":"Hello, let us talk."}'</pre></div>
    <div><p class="lbl">Sign in (stores the cookie)</p><pre>curl -c jar -X POST ${"$"}API/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"…"}'</pre></div>
    <div><p class="lbl">Then call an admin route</p><pre>curl -b jar ${"$"}API/api/admin/overview</pre></div>
  </div>

  <h2>Conventions</h2>
  <ul class="notes">
    <li>Errors are JSON: <code>{ "error": "message", "details": { "field": "reason" } }</code>. Validation failures return 400 with field-level details.</li>
    <li>Status codes: 401 not signed in, 404 not found, 409 duplicate, 429 rate limited.</li>
    <li>Cross-origin clients must send <code>credentials: "include"</code>; the origin has to be listed in <code>CLIENT_URL</code>.</li>
    <li>Updates are full replaces: send the whole document, and omitted optional fields are cleared.</li>
  </ul>

  <footer><span>© ${new Date().getFullYear()} Yamlak Negash</span><span>Node · Express · MongoDB · Zod</span></footer>
</main>
</body>
</html>`;
}

const router = Router();

router.get("/", (req, res) => {
  if (req.accepts(["html", "json"]) === "json") {
    res.json({ name: "portfolio-api", status: "ok", docs: "/", health: "/api/health" });
    return;
  }
  res.type("html").send(page());
});

export default router;
