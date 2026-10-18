import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

let mongod: MongoMemoryServer;
let app: import("express").Express;
let agent: ReturnType<typeof request.agent>;

const ADMIN = { email: "admin@test.dev", password: "correct-horse-battery" };
const project = {
  title: "Test Project — A Platform",
  name: "Test Project",
  summary: "A project used by the test-suite",
  kind: "Web",
  role: "Full-stack",
  categories: ["fintech", "mobile"],
  accent: "#22d3ee",
  accent2: "#6366f1",
  art: "hex",
  featured: true,
  overview: "Overview text",
  challenge: "Challenge text",
  solution: "Solution text",
  features: ["One", "Two"],
  stack: ["React", "Node.js"],
  metrics: [{ value: 9, suffix: "+", label: "things" }],
  arch: { clients: ["Web app"], api: "Express API", back: ["MongoDB"] },
  liveUrl: "https://example.com",
  embedMode: "live",
  order: 0,
  published: true,
};
const goodMessage = { name: "Ada Lovelace", email: "ada@example.com", topic: "project", message: "I'd like to talk about a payments platform." };

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  // Set BEFORE importing the app so tests never touch the real database.
  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = mongod.getUri("portfolio_test");
  process.env.JWT_SECRET = "test-secret-test-secret-test-secret";
  process.env.IMAGEKIT_PRIVATE_KEY = "";
  process.env.IMAGEKIT_URL_ENDPOINT = "";

  const { connectDb } = await import("../src/config/db");
  const { createApp } = await import("../src/app");
  const { AdminUser } = await import("../src/models");

  await connectDb();
  await AdminUser.create({
    email: ADMIN.email,
    passwordHash: await bcrypt.hash(ADMIN.password, 4),
  });
  app = createApp();
  agent = request.agent(app);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("health & errors", () => {
  it("reports database connectivity", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", database: "connected" });
  });

  it("serves an API overview page at / and JSON on request", async () => {
    const html = await request(app).get("/").set("Accept", "text/html");
    expect(html.status).toBe(200);
    expect(html.headers["content-type"]).toMatch(/html/);
    expect(html.text).toContain("/api/admin/messages");
    const json = await request(app).get("/").set("Accept", "application/json");
    expect(json.body).toMatchObject({ status: "ok" });
  });

  it("allows CORS (with credentials) for the site and admin origins only", async () => {
    for (const origin of ["http://localhost:5173", "http://localhost:5174", "https://yamlak-ecru.vercel.app", "https://yn-admin.vercel.app"]) {
      const res = await request(app).options("/api/projects").set("Origin", origin).set("Access-Control-Request-Method", "GET");
      expect(res.headers["access-control-allow-origin"]).toBe(origin);
      expect(res.headers["access-control-allow-credentials"]).toBe("true");
    }
    const other = await request(app).options("/api/projects").set("Origin", "https://evil.example").set("Access-Control-Request-Method", "GET");
    expect(other.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("returns JSON 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe("authentication", () => {
  it("blocks admin routes without a session", async () => {
    const res = await request(app).get("/api/admin/projects");
    expect(res.status).toBe(401);
  });

  it("rejects malformed login bodies with field errors", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "nope" });
    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("email");
  });

  it("rejects a wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: ADMIN.email, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("logs in, sets an httpOnly cookie and serves /me", async () => {
    const login = await agent.post("/api/auth/login").send(ADMIN);
    expect(login.status).toBe(200);
    expect(login.body.user.email).toBe(ADMIN.email);
    expect(String(login.headers["set-cookie"])).toMatch(/HttpOnly/i);

    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(ADMIN.email);
  });

  it("does not leak the JWT in the response body", async () => {
    const login = await request(app).post("/api/auth/login").send(ADMIN);
    expect(login.status).toBe(200);
    expect(login.body.token).toBeUndefined();
  });

  it("accepts a Bearer token for non-browser clients", async () => {
    const { signToken } = await import("../src/middleware/auth");
    const token = signToken({ sub: "507f1f77bcf86cd799439011", email: ADMIN.email });
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("rejects a tampered token", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not.a.jwt");
    expect(res.status).toBe(401);
  });
});

describe("projects CRUD", () => {
  let id: string;

  it("validates input", async () => {
    const res = await agent.post("/api/admin/projects").send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("title");
  });

  it("rejects a bad colour and an unknown category", async () => {
    const res = await agent.post("/api/admin/projects").send({ ...project, accent: "red", categories: ["nope"] });
    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("accent");
  });

  it("creates a project and derives the slug from the title", async () => {
    const res = await agent.post("/api/admin/projects").send(project);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body._id).toBeUndefined();
    expect(res.body.slug).toBe("test-project-a-platform");
    expect(res.body.metrics[0]).toMatchObject({ value: 9, suffix: "+", label: "things" });
    expect(res.body.arch.api).toBe("Express API");
    id = res.body.id;
  });

  it("refuses a duplicate slug with 409", async () => {
    const res = await agent.post("/api/admin/projects").send({ ...project, title: "Another", slug: "test-project-a-platform" });
    expect(res.status).toBe(409);
  });

  it("lists it publicly (no auth)", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe(project.name);
  });

  it("hides unpublished projects from the public list but not from admin", async () => {
    await agent.put(`/api/admin/projects/${id}`).send({ ...project, slug: "test-project-a-platform", published: false });
    expect((await request(app).get("/api/projects")).body).toHaveLength(0);
    expect((await agent.get("/api/admin/projects")).body).toHaveLength(1);
    await agent.put(`/api/admin/projects/${id}`).send({ ...project, slug: "test-project-a-platform", published: true });
  });

  it("clears optional fields on update (liveUrl)", async () => {
    const { liveUrl: _drop, ...withoutLive } = project;
    const res = await agent
      .put(`/api/admin/projects/${id}`)
      .send({ ...withoutLive, slug: "test-project-a-platform", title: "Renamed" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Renamed");
    expect(res.body.liveUrl).toBeUndefined();
  });

  it("rejects invalid ids", async () => {
    const res = await agent.put("/api/admin/projects/not-an-id").send(project);
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown ids", async () => {
    const res = await agent.delete(`/api/admin/projects/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });

  it("reorders projects", async () => {
    const second = await agent.post("/api/admin/projects").send({ ...project, title: "Second Project", name: "Second", order: 1 });
    expect(second.status).toBe(201);
    const ids = [second.body.id, id];
    const res = await agent.put("/api/admin/projects/reorder").send({ ids });
    expect(res.status).toBe(200);
    const list = await request(app).get("/api/projects");
    expect(list.body.map((p: { id: string }) => p.id)).toEqual(ids);
  });

  it("deletes a project", async () => {
    const res = await agent.delete(`/api/admin/projects/${id}`);
    expect(res.status).toBe(204);
    expect((await request(app).get("/api/projects")).body).toHaveLength(1);
  });
});

describe("other resources", () => {
  const cases: [string, string, Record<string, unknown>][] = [
    ["experience", "experience", { title: "Role", company: "Co", period: "2025", description: "Did things", tags: ["a"], order: 0 }],
    ["approach", "approach", { title: "Plan", description: "Plan things", icon: "loop", color: "#8b5cf6", order: 0 }],
    ["stack", "stack", { name: "Frontend", color: "#22d3ee", description: "React etc", items: ["React", "Vite"], order: 0 }],
    ["testimonials", "testimonials", { name: "Ann", quote: "Great", order: 0 }],
    ["social-links", "social-links", { platform: "GitHub", url: "https://github.com/x", note: "hi", order: 0 }],
  ];

  it.each(cases)("%s: create, read publicly, delete", async (_n, route, body) => {
    const created = await agent.post(`/api/admin/${route}`).send(body);
    expect(created.status).toBe(201);
    const list = await request(app).get(`/api/${route}`);
    expect(list.body.some((x: { id: string }) => x.id === created.body.id)).toBe(true);
    const del = await agent.delete(`/api/admin/${route}/${created.body.id}`);
    expect(del.status).toBe(204);
  });

  it("rejects an invalid approach icon", async () => {
    const res = await agent.post("/api/admin/approach").send({ title: "x", description: "y", icon: "rocket" });
    expect(res.status).toBe(400);
  });
});

describe("settings", () => {
  it("serves complete fallback copy before anything is saved", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(200);
    expect(res.body.heroTitle).toBeTruthy();
    expect(res.body.heroRoles.length).toBeGreaterThan(0);
    expect(res.body.stats).toHaveLength(4);
    expect(res.body.id).toBeNull();
  });

  const payload = {
    fullName: "Test Person",
    initials: "TP",
    heroTitle: "Title that ships",
    heroHighlight: "ships",
    heroRoles: ["Engineer", "Designer"],
    heroSubtitle: "Subtitle",
    resumeUrl: "/resume.pdf",
    stats: [{ value: 5, suffix: "+", label: "Things" }],
    email: "me@example.com",
  };

  it("updates settings and persists them", async () => {
    const put = await agent.put("/api/admin/settings").send(payload);
    expect(put.status).toBe(200);
    const get = await request(app).get("/api/settings");
    expect(get.body).toMatchObject({ fullName: "Test Person", heroTitle: "Title that ships", resumeUrl: "/resume.pdf" });
    expect(get.body.heroRoles).toEqual(["Engineer", "Designer"]);
    expect(get.body.id).toBeTruthy();
  });

  it("clears an optional field when it is omitted", async () => {
    const { resumeUrl: _drop, ...rest } = payload;
    await agent.put("/api/admin/settings").send(rest);
    const get = await request(app).get("/api/settings");
    expect(get.body.resumeUrl).toBe("/Yamlak_Resume.pdf"); // falls back to the default copy, not the old value
  });

  it("requires auth to update", async () => {
    const res = await request(app).put("/api/admin/settings").send({});
    expect(res.status).toBe(401);
  });
});

describe("contact requests from the portfolio", () => {
  it("accepts a valid message without auth", async () => {
    const res = await request(app).post("/api/messages").send(goodMessage);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
  });

  it("validates fields with human-readable messages", async () => {
    const res = await request(app).post("/api/messages").send({ name: "A", email: "nope", message: "short" });
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.details).sort()).toEqual(["email", "message", "name"]);
  });

  it("silently drops honeypot submissions (nothing stored)", async () => {
    const before = (await agent.get("/api/admin/messages")).body.items.length;
    const res = await request(app).post("/api/messages").send({ ...goodMessage, email: "bot@spam.dev", website: "http://spam.example" });
    expect(res.status).toBe(201);
    const after = (await agent.get("/api/admin/messages")).body.items.length;
    expect(after).toBe(before);
  });

  it("does not expose the inbox publicly", async () => {
    expect((await request(app).get("/api/admin/messages")).status).toBe(401);
  });

  it("lists messages newest first with an unread count", async () => {
    await request(app).post("/api/messages").send({ ...goodMessage, name: "Grace Hopper", email: "grace@example.com" });
    const res = await agent.get("/api/admin/messages");
    expect(res.status).toBe(200);
    expect(res.body.items[0].name).toBe("Grace Hopper");
    expect(res.body.unread).toBe(2);
    expect(res.body.items[0].ipHash).toBeTruthy();
  });

  it("marks a message read and archived, and filters by status", async () => {
    const list = (await agent.get("/api/admin/messages")).body.items;
    const read = await agent.patch(`/api/admin/messages/${list[0].id}`).send({ status: "read" });
    expect(read.status).toBe(200);
    expect(read.body.status).toBe("read");
    expect(read.body.readAt).toBeTruthy();
    const archived = await agent.patch(`/api/admin/messages/${list[1].id}`).send({ status: "archived" });
    expect(archived.body.status).toBe("archived");
    expect((await agent.get("/api/admin/messages?status=new")).body.items).toHaveLength(0);
    expect((await agent.get("/api/admin/messages?status=archived")).body.items).toHaveLength(1);
  });

  it("rejects an invalid status", async () => {
    const list = (await agent.get("/api/admin/messages")).body.items;
    const res = await agent.patch(`/api/admin/messages/${list[0].id}`).send({ status: "spam" });
    expect(res.status).toBe(400);
  });

  it("marks everything read in one call", async () => {
    await request(app).post("/api/messages").send({ ...goodMessage, name: "Alan Turing", email: "alan@example.com" });
    expect((await agent.get("/api/admin/messages")).body.unread).toBe(1);
    const res = await agent.post("/api/admin/messages/read-all");
    expect(res.status).toBe(200);
    expect(res.body.updated).toBe(1);
    expect((await agent.get("/api/admin/messages")).body.unread).toBe(0);
  });

  it("deletes a message", async () => {
    const list = (await agent.get("/api/admin/messages")).body.items;
    const res = await agent.delete(`/api/admin/messages/${list[0].id}`);
    expect(res.status).toBe(204);
    expect((await agent.get("/api/admin/messages")).body.items).toHaveLength(list.length - 1);
  });
});

describe("overview & upload", () => {
  it("returns per-section counts, including unread messages", async () => {
    const res = await agent.get("/api/admin/overview");
    expect(res.status).toBe(200);
    const projects = res.body.find((s: { key: string }) => s.key === "projects");
    expect(projects.count).toBe(1);
    const messages = res.body.find((s: { key: string }) => s.key === "messages");
    expect(messages.count).toBeGreaterThan(0);
    expect(messages.unread).toBe(0);
  });

  it("rejects non-image uploads", async () => {
    const res = await agent.post("/api/admin/upload").attach("file", Buffer.from("hello"), {
      filename: "a.txt",
      contentType: "text/plain",
    });
    expect(res.status).toBe(400);
  });

  it("stores an image locally and returns a URL", async () => {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    const res = await agent.post("/api/admin/upload").attach("file", png, {
      filename: "pixel test.png",
      contentType: "image/png",
    });
    expect(res.status).toBe(201);
    expect(res.body.url).toMatch(/\/uploads\/\d+-pixel_test\.png$/);

    const name = res.body.url.split("/").pop() as string;
    const served = await request(app).get(`/uploads/${name}`);
    expect(served.status).toBe(200);
    await fs.rm(path.resolve(process.cwd(), "uploads", name), { force: true });
  });

  it("uploads to ImageKit into the configured folder when credentials are set", async () => {
    const { env } = await import("../src/config/env");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ url: "https://ik.imagekit.io/test/yn-portfolio/resume_abc.pdf" }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);
    Object.assign(env, { IMAGEKIT_PRIVATE_KEY: "private_test", IMAGEKIT_URL_ENDPOINT: "https://ik.imagekit.io/test", IMAGEKIT_FOLDER: "yn-portfolio" });
    try {
      const res = await agent.post("/api/admin/upload").attach("file", Buffer.from("%PDF-1.4 test"), {
        filename: "my resume.pdf",
        contentType: "application/pdf",
      });
      expect(res.status).toBe(201);
      expect(res.body.url).toBe("https://ik.imagekit.io/test/yn-portfolio/resume_abc.pdf");

      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("https://upload.imagekit.io/api/v1/files/upload");
      expect((init.headers as Record<string, string>).Authorization).toBe(`Basic ${Buffer.from("private_test:").toString("base64")}`);
      const form = init.body as FormData;
      expect(form.get("folder")).toBe("/yn-portfolio");
      expect(form.get("fileName")).toBe("my_resume.pdf");

      // A provider failure surfaces as 502, not a crash.
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ message: "bad key" }), { status: 401 }));
      const bad = await agent.post("/api/admin/upload").attach("file", Buffer.from("x"), { filename: "a.png", contentType: "image/png" });
      expect(bad.status).toBe(502);
    } finally {
      vi.unstubAllGlobals();
      Object.assign(env, { IMAGEKIT_PRIVATE_KEY: "", IMAGEKIT_URL_ENDPOINT: "" });
    }
  });

  it("logs out and invalidates the cookie", async () => {
    const out = await agent.post("/api/auth/logout");
    expect(out.status).toBe(200);
    const res = await agent.get("/api/admin/projects");
    expect(res.status).toBe(401);
  });
});
