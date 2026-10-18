import { Router } from "express";
import { SiteSettings } from "../models";
import { validate } from "../middleware/validate";
import { settingsSchema } from "../validation/schemas";
import { asyncHandler, serialize } from "../utils/http";

/** Safe default copy served until the first settings document is saved. */
export const SETTINGS_FALLBACK = {
  fullName: "Yamlak Negash",
  initials: "YN",
  location: "Addis Ababa",
  coordinates: "9.03°N 38.74°E",
  timezone: "Africa/Addis_Ababa",
  timezoneLabel: "EAT",
  availability: "Open to new opportunities",
  available: true,
  heroTitle: "I build production software that ships, scales, and gets used.",
  heroHighlight: "ships, scales, and gets used.",
  heroRoles: ["Full-stack engineer", "Mobile engineer", "Fintech integrations", "Real-time systems", "Applied AI"],
  heroSubtitle:
    "Full-stack and mobile engineer who has independently shipped 20+ systems across fintech, healthcare, logistics, hospitality and education. Several are live with real users, real payments and real-time traffic.",
  resumeUrl: "/Yamlak_Resume.pdf",
  stats: [
    { value: 20, suffix: "+", label: "Production systems shipped" },
    { value: 9, suffix: "", label: "Banks & money providers integrated" },
    { value: 400, suffix: "+", label: "Source files in one monorepo" },
    { value: 260, suffix: "+", label: "Commits on a single project" },
  ],
  email: "yamlaknegash96@gmail.com",
  phone: "+251 902 142 767",
  aboutHeading: "An engineer who owns the product end to end.",
  aboutIntro:
    "React, Next.js and React Native on the front. Node, Express and NestJS behind them. MongoDB or PostgreSQL underneath, with real-time and security designed in from the first commit.",
  principle: "Ship the whole slice: interface, API and data, for one real workflow at a time.",
  principleTags: ["Turborepo / pnpm", "JWT · RBAC · multi-tenant", "Socket.IO real-time", "Chapa · Stripe · CBE"],
  dailyStack: ["React", "Next.js", "TypeScript", "Node.js", "Express", "Python / AI"],
  timezoneNote: "UTC+3, with overlap for Europe and the Gulf.",
  learningNote: "Tech enthusiast with a taste for hard systems.",
  ctaHeading: "Have something that needs to ship?",
  contactHeading: "Ready to build something that ships?",
  contactHighlight: "ships?",
  contactIntro: "Tell me what you're building, who it's for and when it needs to be live. I reply to every serious message.",
  insideScoop:
    "Leading NYDev: production systems across fintech, health-tech and edtech, from national blood-bank logistics to AI tutoring.",
  scoopRole: "Lead Full-Stack Developer",
  scoopSince: "Oct 2025 – now",
  educationSchool: "Addis Ababa University",
  educationDegree: "B.Sc. Software Engineering · expected 2027",
  languages: "English (professional) · Amharic (native)",
};

const getSettings = asyncHandler(async (_req, res) => {
  const doc = await SiteSettings.findOne().lean();
  res.json(doc ? serialize({ ...SETTINGS_FALLBACK, ...doc }) : { id: null, ...SETTINGS_FALLBACK });
});

export const publicSettingsRouter = Router();
publicSettingsRouter.get("/", getSettings);

const keys = Object.keys(settingsSchema.shape);

export const adminSettingsRouter = Router();
adminSettingsRouter.get("/", getSettings);
adminSettingsRouter.put(
  "/",
  validate(settingsSchema),
  asyncHandler(async (req, res) => {
    // Same rule as the collection resources: cleared optional fields are removed, not kept.
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, 1> = {};
    for (const key of keys) {
      if (req.body[key] === undefined) $unset[key] = 1;
      else $set[key] = req.body[key];
    }
    const doc = await SiteSettings.findOneAndUpdate(
      {},
      { $set, ...(Object.keys($unset).length ? { $unset } : {}) },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ).lean();
    res.json(serialize({ ...SETTINGS_FALLBACK, ...doc! }));
  })
);
